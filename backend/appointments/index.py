import json
import os
import psycopg2
from datetime import datetime
import requests

def handler(event: dict, context) -> dict:
    """API для работы с записями на консультации"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    try:
        db_url = os.environ['DATABASE_URL']
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            client_email = body.get('email')
            client_name = body.get('name')
            client_phone = body.get('phone')
            appointment_date = body.get('date')
            appointment_time = body.get('time')
            
            if not all([client_email, client_name, appointment_date, appointment_time]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Не все обязательные поля заполнены'})
                }
            
            cur.execute(
                "SELECT id FROM clients WHERE email = %s",
                (client_email,)
            )
            result = cur.fetchone()
            
            if result:
                client_id = result[0]
            else:
                cur.execute(
                    "INSERT INTO clients (email, name, phone, password_hash) VALUES (%s, %s, %s, %s) RETURNING id",
                    (client_email, client_name, client_phone or '', 'temp_hash')
                )
                client_id = cur.fetchone()[0]
            
            cur.execute(
                "INSERT INTO appointments (client_id, appointment_date, appointment_time, status) VALUES (%s, %s, %s, %s) RETURNING id",
                (client_id, appointment_date, appointment_time, 'scheduled')
            )
            appointment_id = cur.fetchone()[0]
            conn.commit()
            
            send_telegram_notification(
                f"📅 Новая запись!\n\n"
                f"Имя: {client_name}\n"
                f"Email: {client_email}\n"
                f"Телефон: {client_phone or 'не указан'}\n"
                f"Дата: {appointment_date}\n"
                f"Время: {appointment_time}"
            )
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'appointmentId': appointment_id})
            }
        
        elif method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            email = query_params.get('email')
            
            if email:
                cur.execute(
                    """SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.notes 
                       FROM appointments a 
                       JOIN clients c ON a.client_id = c.id 
                       WHERE c.email = %s 
                       ORDER BY a.appointment_date DESC, a.appointment_time DESC""",
                    (email,)
                )
            else:
                cur.execute(
                    """SELECT a.id, a.appointment_date, a.appointment_time, a.status, c.name, c.email 
                       FROM appointments a 
                       JOIN clients c ON a.client_id = c.id 
                       ORDER BY a.appointment_date DESC, a.appointment_time DESC 
                       LIMIT 50"""
                )
            
            appointments = []
            for row in cur.fetchall():
                if email:
                    appointments.append({
                        'id': row[0],
                        'date': str(row[1]),
                        'time': row[2],
                        'status': row[3],
                        'notes': row[4]
                    })
                else:
                    appointments.append({
                        'id': row[0],
                        'date': str(row[1]),
                        'time': row[2],
                        'status': row[3],
                        'name': row[4],
                        'email': row[5]
                    })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'appointments': appointments})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
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
