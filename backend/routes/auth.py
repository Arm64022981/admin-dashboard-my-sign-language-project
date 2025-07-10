from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from psycopg2.extras import RealDictCursor
from db import get_db_connection

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/api')

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        fullname = data.get('fullname')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        department = data.get('department')

        if not fullname or not email or not password or not role or not department:
            return jsonify({'success': False, 'message': 'กรุณากรอกข้อมูลให้ครบถ้วน'}), 400

        hashed_password = generate_password_hash(password)

        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        if role == "nurse":
            cursor.execute("SELECT * FROM nurses WHERE email = %s;", (email,))
        elif role == "doctor":
            cursor.execute("SELECT * FROM doctors WHERE email = %s;", (email,))
        else:
            return jsonify({'success': False, 'message': 'ตำแหน่งไม่ถูกต้อง'}), 400

        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({'success': False, 'message': 'อีเมลนี้มีผู้ใช้งานแล้ว'}), 400

        if role == "nurse":
            cursor.execute(
                "INSERT INTO nurses (fullname, email, password, department, role) VALUES (%s, %s, %s, %s, %s);",
                (fullname, email, hashed_password, department, role)
            )
        elif role == "doctor":
            cursor.execute(
                "INSERT INTO doctors (fullname, email, password, department, role) VALUES (%s, %s, %s, %s, %s);",
                (fullname, email, hashed_password, department, role)
            )

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'success': True, 'message': 'การสมัครสมาชิกสำเร็จ'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
