# routes/__init__.py

from .auth import auth_bp
from .doctor import doctor_bp
from .nurse import nurse_bp
from .patient import patient_bp
from .report import report_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(doctor_bp)
    app.register_blueprint(nurse_bp)
    app.register_blueprint(patient_bp)
    app.register_blueprint(report_bp)
