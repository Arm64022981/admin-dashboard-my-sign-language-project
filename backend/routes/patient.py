from flask import Blueprint, jsonify
from db import get_db_connection
import traceback

patient_bp = Blueprint('patient_bp', __name__, url_prefix='/api')

@patient_bp.route('/patients', methods=['GET'])
def get_patients():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT 
                p.id, 
                p.name, 
                p.admission_date, 
                p.nurse_name, 
                COALESCE(STRING_AGG(d.doctor_name, ', '), '') AS doctor_name
            FROM patients p
            LEFT JOIN diagnoses d ON d.patient_id = p.id_card
            GROUP BY p.id, p.name, p.admission_date, p.nurse_name
            ORDER BY p.id;
        """)
        patients = cur.fetchall()
        conn.close()

        return jsonify([
            {
                'id': p[0],
                'name': p[1],
                'admissionDate': p[2],
                'nurseName': p[3],
                'doctorName': p[4]
            } for p in patients
        ])
    except Exception as e:
        print("Error in get_patients:", e)
        print(traceback.format_exc())
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500

@patient_bp.route('/patients/<int:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM patients WHERE id = %s", (patient_id,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "ลบข้อมูลผู้ป่วยเรียบร้อยแล้ว"})
    except Exception as e:
        print("Error in delete_patient:", e)
        print(traceback.format_exc())
        return jsonify({"error": f"ไม่สามารถลบข้อมูลได้: {str(e)}"}), 500
