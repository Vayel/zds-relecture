import uuid

from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

database = dict()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/updated")
def updated():
    return render_template("updated.html")


@app.route("/search")
def search():
    page_id = request.args["page"]
    annotations = [ann for ann in database.values() if ann["page"] == page_id] 
    return jsonify({
        "total": len(annotations),
        "rows": annotations,
    })


@app.route("/create", methods=["POST"])
def create():
    annotation = request.get_json()
    annotation_id = uuid.uuid4()
    database[annotation_id] = annotation 
    return jsonify({"status": "success", "id": annotation_id})


@app.route("/update/<int:annotation_id>", methods=["POST"])
def update(annotation_id):
    annotation = request.get_json()
    database[annotation_id] = annotation 
    return jsonify({"status": "success"})


@app.route("/delete/<int:annotation_id>", methods=["POST"])
def delete(annotation_id):
    try:
        database.pop(annotation_id)
    except KeyError:
        return jsonify({"status": "error"})
    return jsonify({"status": "success"})


if __name__ == "__main__":
    app.run(debug=True)
