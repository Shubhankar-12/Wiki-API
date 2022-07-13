const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(express.static('public'));
app.set('view-engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = new mongoose.model("Article", articleSchema);

app.route('/articles')
    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (!err)
                res.send(foundArticles);
            else
                res.send(err);
        });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save((err) => {
            if (err)
                res.send(err);
            else
                res.send("Successfully posted!");
        });
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (err)
                res.send(err);
            else
                res.send("Deleted Successfully!");
        });
    });


app.route('/articles/:articleTitle')
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (foundArticle)
                res.send(foundArticle);
            else
                res.send("No article found!")
        })
    })
    .put((req, res) => {
        Article.replaceOne({ title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            (err) => {
                if (!err)
                    res.send("Updated successfully!")
                else
                    res.send(err)
            }
        )
    })
    .patch((req, res) => {
        Article.updateOne({ title: req.params.articleTitle },
            { $set: req.body },
            (err) => {
                if (err)
                    res.send(err);
                else
                    res.send('patched successfully!');
            })
    })
    .delete((req, res) => {
        Article.deleteOne({ title: req.params.articleTitle }, (err) => {
            if (err)
                res.send(err);
            else
                res.send("Deleted Successfully!");
        });
    });


app.listen(3000, () => {
    console.log("Server started listening on 3000");
})