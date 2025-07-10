from flask import Blueprint, jsonify, request
from db import get_db_connection
import re

doctor_bp = Blueprint('doctor_bp', __name__, url_prefix='/api')

@doctor_bp.route('/doctors/count', methods=['GET'])
def get_doctor_count():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM doctors;")
    doctor_count = cur.fetchone()[0]
    conn.close()
    return jsonify({'doctorCount': doctor_count})

@doctor_bp.route('/doctors', methods=['GET'])
def get_doctors():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT 
            doctor_id, user_id, department_id, fullname, 
            gender, birthdate, contact_number, email, 
            department, role
        FROM doctors;
    """)
    doctors = cur.fetchall()
    conn.close()
    return jsonify([{
        'doctor_id': d[0],  
        'user_id': d[1],
        'department_id': d[2],
        'fullname': d[3],
        'gender': d[4],
        'birthdate': d[5],
        'contact_number': d[6],
        'email': d[7],
        'department': d[8],
        'role': d[9]
    } for d in doctors])

@doctor_bp.route('/doctors/<int:doctor_id>', methods=['DELETE'])
def delete_doctor(doctor_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM doctors WHERE doctor_id = %s', (doctor_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': f'Doctor with ID {doctor_id} deleted successfully'}), 200

@doctor_bp.route('/doctors/<int:doctor_id>', methods=['PUT'])
def update_doctor(doctor_id):
    try:
        data = request.get_json() or {}
        fields = {}

        if 'department_id' in data:
            dep_id = data.get('department_id')
            if dep_id not in (None, ''):
                try:
                    fields['department_id'] = int(dep_id)
                except ValueError:
                    return jsonify({'error': 'Invalid department_id'}), 400
            else:
                fields['department_id'] = None

        if 'fullname' in data:
            fullname = data['fullname'].strip()
            if not fullname:
                return jsonify({'error': 'fullname cannot be empty'}), 400
            fields['fullname'] = fullname

        if 'gender' in data:
            gender = data['gender'].strip()
            if gender not in ['ชาย', 'หญิง']:
                return jsonify({'error': 'Invalid gender'}), 400
            fields['gender'] = gender

        if 'contact_number' in data:
            contact_number = data['contact_number'].strip().replace(" ", "")
            if not re.match(r"^[0-9]{10}$", contact_number):
                return jsonify({'error': 'Invalid contact number'}), 400
            fields['contact_number'] = contact_number

        if 'email' in data:
            email = data['email'].strip()
            if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
                return jsonify({'error': 'Invalid email'}), 400
            fields['email'] = email

        if not fields:
            return jsonify({'error': 'No valid fields to update'}), 400

        set_clause = ', '.join([f"{key} = %s" for key in fields.keys()])
        values = list(fields.values())
        values.append(doctor_id)

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(f"""
            UPDATE doctors
            SET {set_clause}
            WHERE doctor_id = %s
        """, values)

        if cursor.rowcount == 0:
            return jsonify({'error': f'Doctor ID {doctor_id} not found'}), 404

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': f'Doctor ID {doctor_id} updated'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
