import json
import os
import psycopg2
import requests

def handler(event: dict, context) -> dict:
    """API для обработки контактных форм"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        name = body.get('name')
        email = body.get('email')
        phone = body.get('phone', '')
        message = body.get('message')
        
        if not all([name, email, message]):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Не все обязательные поля заполнены'})
            }
        
        db_url = os.environ['DATABASE_URL']
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        cur.execute(
            "INSERT INTO contact_messages (name, email, phone, message) VALUES (%s, %s, %s, %s) RETURNING id",
            (name, email, phone, message)
        )
        message_id = cur.fetchone()[0]
        conn.commit()
        
        send_telegram_notification(
            f"💬 Новое сообщение!\n\n"
            f"Имя: {name}\n"
            f"Email: {email}\n"
            f"Телефон: {phone or 'не указан'}\n\n"
            f"Сообщение:\n{message}"
        )
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'messageId': message_id})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

def send_telegram_notification(message: str):
    """Отправка уведомления в Telegram"""
    try:
        token = os.environ.get('TELEGRAM_BOT_TOKEN')
        chat_id = os.environ.get('TELEGRAM_CHAT_ID')
        
        if token and chat_id:
            url = f'https://api.telegram.org/bot{token}/sendMessage'
            requests.post(url, json={'chat_id': chat_id, 'text': message, 'parse_mode': 'HTML'})
    except:
        pass
