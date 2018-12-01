import shelve
import uuid

from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

db_path = "database/annotations"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/updated")
def updated():
    return render_template("updated.html")


@app.route("/search")
def search():
    content_id = request.args["content_id"]
    with shelve.open(db_path) as db:
        annotations = [ann for ann in db.values() if ann["content_id"] == content_id] 
    return jsonify({
        "total": len(annotations),
        "rows": annotations,
    })


@app.route("/create", methods=["POST"])
def create():
    annotation = request.get_json()
    annotation_id = str(uuid.uuid4())
    with shelve.open(db_path) as db:
        db[annotation_id] = annotation 
    return jsonify({"status": "success", "id": annotation_id})


@app.route("/update/<int:annotation_id>", methods=["POST"])
def update(annotation_id):
    annotation = request.get_json()
    with shelve.open(db_path) as db:
        db[annotation_id] = annotation 
    return jsonify({"status": "success"})


@app.route("/delete/<int:annotation_id>", methods=["POST"])
def delete(annotation_id):
    status = "success"
    with shelve.open(db_path) as db:
        try:
            db.pop(annotation_id)
        except KeyError:
            status = "error" 
    return jsonify({"status": status})


if __name__ == "__main__":
    app.run(debug=True)
