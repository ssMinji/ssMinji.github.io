---
layout: post
title: "[webpack] webpack 버전 1에서 4로 바꾸면서 겪었던 config 변경사항"
tags: [webpack, babel, config]
date: 2020-07-03 17:34
---

#### [webpack] webpack 버전 1에서 4로 바꾸면서 겪었던 config 변경사항
---

1.x 버전이던 webpack을 4.x로 업데이트하다보니 기존 webpack.config.js 에서 수정사항이 많았다. 
webpack 4 와 babel 7, babel-loader 8 을 이용해 개발환경을 셋팅했음을 밝힌다. 


1. ```Configuration.resolve has an unknown property 'loaders'``` Error

```module```내에 존재하던 ```loaders``` 설정이 ```rules```로 바뀌었다. 
아래의 코드는 기존 설정 파일이다. 
참고로, react-hot-loader 4.x를 사용하고 있기 때문에 plugins 항목에 써주면 된다. 
```javascript 
// Old version of webpack.config.js

module:{
    loaders: [
        {
            test: /.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                cacheDirectory: true,
                presets: ['es2015', 'react'],
                plugins: ["react-hot-loader/babel"]
            }
        }
    ]
},
```

다음의 형식으로 바꾸어주어야 한다. 
```javascript 
// New version of webpack.config.js

module:{
    rules: [
        {
            test: /.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                cacheDirectory: true,
                presets: ['@babel/react', '@babel/env'],
                plugins: ['react-hot-loader/babel']
            }
        }
    ]
},
```

이 과정에서 ```rules``` 외에도 바꿔주어야 할 사항들이 몇 가지 더 있는데, 

1-1) loader의 이름을 ```babel```에서 ```babel-loader```로 바꿔줘야 한다. 
1.x대 버전에서는 loader를 생략 가능했는데 이제는 생략이 안되도록 바뀐 모양이다. 

2-2) presets

```['es2015', 'react']```에서 ```['@babel/react', '@babel/env']```로. 
```npm install -D```을 이용해 패키지도 그에 맞게 설치해준다. 
ex) ```npm install -D @babel/preset-react @babel/preset-env```


2. ```Configuration.resolve has an unknown property 'root'``` Error

코드를 작성할 때 ```import```문을 작성하다보면 상대 경로로 작성하다보니 복잡해지는 경우를 겪을 수 있는데, 
root path를 등록해 절대경로로 ```import```를 간결하게 할 수 있다. 

```javascript 
// Old version of webpack.config.js

module:{
    resolve: {
        root: path.resolve('./src')
    }
},
```

를 해주게 되면, 예를 들어 ```import SOMETHING from './src/components';```로 해야했던 코드가 ```import SOMETHING from 'components';```로 간결해질 수 있다. 
하지만 webpack above 2.x부터는 root가 사라졌기 때문에, 아래처럼 바꿔준다. 

```javascript 
// New version of webpack.config.js

module:{
    modules: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'src/')
    ]
},
```

혹은, 원하는 경로마다 이름을 붙여줄 수 있는 듯 하다. 

```javascript 
// New version of webpack.config.js

module:{
    alias: {
        Actions: path.resolve(__dirname, 'src/actions/'),
        Components: path.resolve(__dirname, 'src/components/'),
        Containers: path.resolve(__dirname, 'src/containers/'),
        Reducers: path.resolve(__dirname, 'src/reducers')
    }
},
```

위와 같이 작성하면, ```import { SOMETHING } from 'Actions';``` 로 임포트문을 작성할 수 있다. 

3. ```plugins``` 플러그인 이름 변경 

```OccurenceOrderPlugin```이 ```OccurrencePlugin```으로 변경되었다. 무슨 차이냐면? r이 하나 더 붙는다 ㅎㅎㅎ 기존의 플러그인에 오타가 있었구나 싶어서 신기,,
그리고, ```NoErrorsPlugin```이 ```NoEmitOnErrorsPlugin```으로 변경되었다. 나는 초반에 이것때문에 ```[nodemon] app crashed - waiting for file changes before starting...``` 에러가 나서 찾아보니 바뀌었다고 한다.

webpack 버전을 업데이트하니 babel 버전 등이 꼬여서 자꾸만 에러가 났는데..
답은 문제에 있는 것처럼 디버깅은 에러메시지에 있음을 다시 한 번 깨닫고 
절망하지말고 에러메시지를 찬찬히 읽어보도록하자..
덕분에 버전관리와 config 파일에 대해 공부할 수 있었다~.~ 













