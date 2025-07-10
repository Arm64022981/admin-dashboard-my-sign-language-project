from flask import Blueprint, jsonify, request
from db import get_db_connection
import re
from psycopg2 import errors

nurse_bp = Blueprint('nurse_bp', __name__, url_prefix='/api')

@nurse_bp.route('/nurses/count', methods=['GET'])
def get_nurse_count():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM nurses;")
    nurse_count = cur.fetchone()[0]
    conn.close()
    return jsonify({'nurseCount': nurse_count})

@nurse_bp.route('/nurses', methods=['GET'])
def get_nurses():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT 
            nurses_id, user_id, department_id, fullname, 
            gender, birthdate, contact_number, email, 
            department, role
        FROM nurses;
    """)
    nurses = cur.fetchall()
    conn.close()

    return jsonify([
        {
            'nurses_id': n[0],
            'user_id': n[1],
            'department_id': n[2],
            'fullname': n[3],
            'gender': n[4],
            'birthdate': n[5],
            'contact_number': n[6],
            'email': n[7],
            'department': n[8],
            'role': n[9]
        }
        for n in nurses
    ])

@nurse_bp.route('/nurses/<int:nurses_id>', methods=['DELETE'])
def delete_nurse(nurses_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM nurses WHERE nurses_id = %s', (nurses_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': f'Nurse with ID {nurses_id} deleted successfully'}), 200

@nurse_bp.route('/nurses/<int:nurses_id>', methods=['PUT'])
def update_nurse(nurses_id):
    try:
        data = request.get_json() or {}
        fields = {}

        if 'department_id' in data:
            dep_id = data.get('department_id')
            if dep_id is not None and dep_id != '':
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
        values.append(nurses_id)

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(f"""
            UPDATE nurses
            SET {set_clause}
            WHERE nurses_id = %s
        """, values)

        if cursor.rowcount == 0:
            return jsonify({'error': f'Nurse ID {nurses_id} not found'}), 404

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': f'Nurse ID {nurses_id} updated'}), 200

    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid department_id'}), 400
    except errors.CheckViolation:
        return jsonify({'error': 'Invalid gender'}), 400
    except errors.ForeignKeyViolation:
        return jsonify({'error': 'Invalid department_id'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
