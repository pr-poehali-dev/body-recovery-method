import json
import os
import psycopg2
from datetime import datetime, timedelta

def handler(event: dict, context) -> dict:
    """API для отслеживания прогресса клиентов"""
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
            email = body.get('email')
            metrics = body.get('metrics', {})
            
            if not email or not metrics:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email и метрики обязательны'})
                }
            
            cur.execute("SELECT id FROM clients WHERE email = %s", (email,))
            result = cur.fetchone()
            
            if not result:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Клиент не найден'})
                }
            
            client_id = result[0]
            
            for metric_name, metric_value in metrics.items():
                cur.execute(
                    "INSERT INTO progress_tracking (client_id, metric_name, metric_value) VALUES (%s, %s, %s)",
                    (client_id, metric_name, int(metric_value))
                )
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
        
        elif method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            email = query_params.get('email')
            
            if not email:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email обязателен'})
                }
            
            cur.execute("SELECT id FROM clients WHERE email = %s", (email,))
            result = cur.fetchone()
            
            if not result:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Клиент не найден'})
                }
            
            client_id = result[0]
            
            cur.execute(
                """SELECT metric_name, metric_value, recorded_at 
                   FROM progress_tracking 
                   WHERE client_id = %s 
                   ORDER BY recorded_at DESC""",
                (client_id,)
            )
            
            progress_data = {}
            for row in cur.fetchall():
                metric_name = row[0]
                if metric_name not in progress_data:
                    progress_data[metric_name] = []
                progress_data[metric_name].append({
                    'value': row[1],
                    'date': row[2].isoformat()
                })
            
            latest_metrics = {}
            for metric_name, values in progress_data.items():
                if values:
                    latest_metrics[metric_name] = values[0]['value']
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'latestMetrics': latest_metrics,
                    'history': progress_data
                })
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
