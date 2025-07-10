from flask import Blueprint, jsonify
from db import get_db_connection
from psycopg2.extras import RealDictCursor

report_bp = Blueprint('report_bp', __name__, url_prefix='/api')

@report_bp.route('/reports', methods=['GET'])
def get_reports():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)  
    cursor.execute('SELECT * FROM reports ORDER BY created_at DESC')
    reports = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(reports)

@report_bp.route('/reports/<int:report_id>', methods=['DELETE'])
def delete_report(report_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM reports WHERE id = %s', (report_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': f'Report with ID {report_id} deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Error deleting report', 'error': str(e)}), 500
