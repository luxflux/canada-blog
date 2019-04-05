---
title: Blog
---
{{ define "main" }}
  {{ range .Pages }}
  <div class="post">
    <h2 class="post__title">
      <a href="{{ .Permalink }}">
        {{ .Params.title }}
      </a>
    </h2>
    <img class="post__image" src={{ .Params.image }} />
    <div class="post__content">
      {{ .Content }}
    </div>
  </div>
  {{ printf "%#v" .Params }}
  {{ end }}
{{ end }}
