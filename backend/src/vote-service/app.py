import json
import boto3
import uuid
from datetime import datetime
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Votes')

def lambda_handler(event, context):
    try:
        # CORS Preflight
        if event['httpMethod'] == 'OPTIONS':
             return cors_response(200, {})

        body = json.loads(event['body'])
        poll_id = body.get('poll_id')
        option = body.get('option')
        
        # 1. IP Adresini Bul (AWS API Gateway bu bilgiyi otomatik ekler)
        # Yerel testlerde IP olmayabilir, 'unknown' varsayalım.
        user_ip = event['requestContext']['identity']['sourceIp'] if 'requestContext' in event else 'unknown'
        
        if not option or not poll_id:
            return cors_response(400, {'message': 'Eksik bilgi.'})

        # 2. Mükerrer Oy Kontrolü (Aynı IP, Aynı Anket)
        # Not: Büyük ölçekte GSI (Index) kullanmak daha iyidir ama şimdilik Scan iş görür.
        response = table.scan(
            FilterExpression=Attr('poll_id').eq(poll_id) & Attr('ip_address').eq(user_ip)
        )
        
        if response['Count'] > 0:
            return cors_response(403, {'message': 'Zaten oy kullandınız!'})

        # 3. Oyu Kaydet (IP ile beraber)
        vote_id = str(uuid.uuid4())
        table.put_item(
            Item={
                'id': vote_id,
                'poll_id': poll_id,
                'option': option,
                'ip_address': user_ip, # <-- IP'yi de kaydediyoruz
                'timestamp': datetime.now().isoformat()
            }
        )
        return cors_response(200, {'message': 'Oy alındı!', 'vote_id': vote_id})

    except Exception as e:
        print(e)
        return cors_response(500, {'message': str(e)})

def cors_response(status, body):
    return {
        'statusCode': status,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(body)
    }