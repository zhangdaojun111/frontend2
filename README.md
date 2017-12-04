## 定制写法2.0(暂未真实使用)

### 第一步 改造原始组件
- 原始类的构造函数只能接受一个参数，那就是extendConfig，
- 设置原始类的默认config

` 
let animalConfig = {
     template: '<button>animal click</button><p>test</p>',
     binds: [
         {
             event: 'click',
             selector: 'button',
             callback: function () {
                 console.log('animal click');
             }
         },{
             event: 'click',
             selector: 'p',
             callback: function () {
                 console.log('animal p click');
             }
         }
     ],
     afterRender: function () {
         console.log('animal after render');
     }
 }
 class Animal extends Component {
    // 构造函数必须按如下格式改造
     constructor(extendConfig){
         super($.extend(true, {}, animalConfig, extendConfig));
     }
 }
 // 保存默认config
 Animal.config = animalConfig;
` 
### 第二步 继承原始类
采用这一种方式写的继承, 能读取父级的方法

`
let Bird = Animal.extend({
  template: '<button>bird click</button><p>test</p>',
  binds: [
      {
          event: 'click',
          selector: 'button',
          callback: function () {
              console.log('bird click');
          }
      }
  ],
  afterRender: function () {
      this._super.afterRender();
      console.log('bird after render');
  }
});
`

- 注意：这个_super对象指向的是父级类的config，如果父级类里不存在某个方法，而根级又存在这个方法时，_super里面也是不存在的这个方法的，
- 在多级继承的时候，这个_super也是嵌套的，比如

`
 let Swallow = Bird.extend({
     template: '<button>swallow click</button><p>test</p>',
     binds: [
         {
             event: 'click',
             selector: 'button',
             callback: function () {
                 console.log('swallow click');
             }
         }
     ],
     afterRender: function () {
        // 调用animal的afterRender
         this._super._super.afterRender();
         console.log('swallow after render');
     }
 })
`
 
### scss和html的方法与之前的保持一致

## 定制继承1.0
 
### 组件binds继承的bug

- 组件的binds由于是一个数组，在对象覆盖的时候，jq对数组的继承是按数组的序号进行覆盖，所以binds的继承得特殊处理

### 注意事项

- 定制开发的准则是，原则上不允许直接修改app目录内的逻辑代码，允许修改源码内的文件引用。

- 定制开发的逻辑代码是最终会合并到master，同时也为了能方便管理，所以必须按照相应的目录划分保存。

### 定制开发的项目，会有三个地方与master不一致，包含如下：

- app目录下的源码可能会修改（html，js，scss）

- template目录下的模板可能会修改

- webpack打包文件的配置可能需要更改

### 下面讲解这三种情况下如何定制开发

- 在根目录下有一个custom目录，专门用来存放定制开发的代码，如图所示：

- custom目录下，根据定制项目的名称来命名各个定制项目，比如fof的定制就取名为fof，该定制下的所有差异代码都存放在fof下的app目录里面。注意：此app目录下面的结构，必须与外面app的目录结构一模一样。然后还有一个entrys.config.js是fof定制项目的webpack打包配置。

- HTML，任何修改html模板文件的地方，必须新建一个同样的文件，copy原始代码到新文件，然后修改好之后，通过修改原始引用文件的路径的方式进行替换。

- JS，90%的情况可以采用新建js文件，创建一个相同的class继承需要修改的class，然后重写需要修改的部分。

- SCSS，scss的修改方式，与上面的有所不同，css可以继承，只需要按目录结构新增一个scss文件，将需要修改的内容写入，然后同时引用老文件和新文件，新文件不同的部分会自动覆盖老文件的。

### 模板的定制，模板的目录结构如下：

定制的模板必须按如上的规则存放，在访问模板的时候通过url带参数的方式，（http://localhost:8089/index?custom=fof，暂定是这样的方式，可能会更改，不过原理就是这样不变）python会默认去找custom/fof目录下有没有index这个模板，如果找到了就用fof下的index，如果未找到还是会返回查找默认template目录下的index。

- 关于打包的修改方法，定制项目的打包配置的修改主要是entry的修改，先将这部分配置单独抽出来放在entrys.config.js里，默认的配置就存放在根目录，定制的就存放在上面的图中的位置。相应的命令行的命令有修改：

- 开发过程：默认 npm run start    定制  npm run start -- --env.path fof

- 发布过程：默认 npm run build   定制  npm run build -- --env.path fof
