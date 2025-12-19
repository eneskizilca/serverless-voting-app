import json
import boto3
from collections import Counter

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Votes')

def lambda_handler(event, context):
    try:
        # 1. Frontend'den gelen 'poll_id'yi al
        # (Örn: .../results?poll_id=anket-123)
        poll_id = None
        if event.get('queryStringParameters'):
            poll_id = event['queryStringParameters'].get('poll_id')

        # 2. Tüm oyları çek (Scan)
        response = table.scan()
        items = response.get('Items', [])
        
        # 3. FİLTRELEME ZAMANI! 
        # Eğer bir poll_id istendiyse, sadece ona ait oyları ayıkla.
        if poll_id:
            items = [item for item in items if item.get('poll_id') == poll_id]
        
        # 4. Sayım yap
        counts = Counter(item['option'] for item in items)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps(dict(counts))
        }

    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'headers': { 'Access-Control-Allow-Origin': '*' },
            'body': json.dumps({'message': str(e)})
        }