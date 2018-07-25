<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>{{title}}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body{
      margin: 30px;
    }
    a{
      display: block;
      font-size: 20px;
    }
  </style>
</head>
<body>
  {{#each files}}
    <a href="{{../dir}}/{{this}}">{{this}}</a>
  {{/each}}
</body>
</html>
