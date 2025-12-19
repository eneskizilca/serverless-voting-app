import json
import pg8000.native
import uuid
from urllib.parse import urlparse

# ---------------------------------------------------------
# BURAYA SUPABASE LINKINI YAPIŞTIR
# Örnek: "postgresql://postgres.abcd:sifreniz@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
# ---------------------------------------------------------
DB_URL = "postgresql://postgres.xwnnexnprkvuoszxjvzx:DevOps5223@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"

def get_db_connection():
    # Linki parçalayıp pg8000'e uygun hale getiriyoruz
    result = urlparse(DB_URL)
    return pg8000.native.Connection(
        user=result.username,
        password=result.password,
        host=result.hostname,
        port=result.port,
        database=result.path[1:] # baştaki / işaretini kaldır
    )

def lambda_handler(event, context):
    conn = None
    try:
        conn = get_db_connection()
        
        # 1. Tablo Oluştur
        conn.run("""
            CREATE TABLE IF NOT EXISTS polls (
                id TEXT PRIMARY KEY,
                question TEXT NOT NULL,
                option_a TEXT NOT NULL,
                option_b TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # 2. POST İsteği (Anket Ekle)
        if event['httpMethod'] == 'POST':
            body = json.loads(event['body'])
            question = body.get('question')
            opt_a = body.get('option_a')
            opt_b = body.get('option_b')
            
            if not question: return cors_response(400, {'message': 'Eksik bilgi.'})

            poll_id = str(uuid.uuid4())
            conn.run(
                "INSERT INTO polls (id, question, option_a, option_b) VALUES (:id, :q, :oa, :ob)",
                id=poll_id, q=question, oa=opt_a, ob=opt_b
            )
            return cors_response(200, {'message': 'Anket Kaydedildi (PostgreSQL + pg8000)!', 'id': poll_id})
        
        # 3. GET İsteği (Listele)
        elif event['httpMethod'] == 'GET':
            # created_at sütununa göre tersten (en yeni en üstte) sırala
            rows = conn.run("SELECT id, question, option_a, option_b FROM polls ORDER BY created_at DESC")
            polls = [{"id": r[0], "question": r[1], "option_a": r[2], "option_b": r[3]} for r in rows]
            return cors_response(200, polls)

    except Exception as e:
        print(f"HATA: {str(e)}")
        return cors_response(500, {'message': str(e)})
    finally:
        if conn: conn.close()

def cors_response(s, b):
    return {
        'statusCode': s,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(b)
    }