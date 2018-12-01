# ZDS-Relecture - AnnotatorJS

Un exemple de comment AnnotatorJS peut être utilisé dans le cadre de la relecture
de contenus sur Zeste de Savoir.

Deux contenus artificiels sont présents dans `templates`, `updated.html` contenant
le même texte que `index.html` à une modification près (pour observer comment
se comporte AnnotatorJS d'une version à l'autre d'un contenu).

Les annotations sont rendues persistentes via une base de données gérée par
`server.py`. Elles apparaissent en jaune quand elles portent sur la version
courante du contenu (définie en bas du fichier HTML correspondant), en rouge
sinon.

## Installation

Dépendances :

* Python 3.6+
* [Flask](http://flask.pocoo.org/)

```bash
python server.py
```

## Usage

Visiter [http://127.0.0.1:5000/](http://127.0.0.1:5000/) ou
[http://127.0.0.1:5000/updated](http://127.0.0.1:5000/updated) puis sélectionner
du texte pour commenter.
