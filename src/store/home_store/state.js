export const state = {
  // 轮播图片
  bannerImgs: [
    {bannerImg: require('@/assets/images/b-1.jpg')},
    {bannerImg: require('@/assets/images/b-2.jpg')},
    {bannerImg: require('@/assets/images/b-3.jpg')}
  ],
  //栏目数据
  columnData: [
    {id: 0, isHot: 1, typeDesc: '最新推荐', createdAt: '-未知-', updatedAt: '-未知-', recommendImages: [
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'},
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'},
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'},
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'},
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'}
    ]},
    {id: 1, type: 'latte', typeDesc: '拿铁', createdAt: '-未知-', updatedAt: '-未知-', recommendImages: [
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'},
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'},
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'},
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'},
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'}

    ]},
    {id: 2, type: 'coffee', typeDesc: '咖啡', createdAt: '-未知-', updatedAt: '-未知-', recommendImages: [
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'},
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'},
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'},
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'},
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'},

    ]},
    {id: 3, type: 'rena_ice', typeDesc: '瑞纳冰', createdAt: '-未知-', updatedAt: '-未知-', recommendImages: [
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'},
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'},
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'},
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'},
      {name: '拿铁', enname: 'Latte', smallImg: require('@/assets/images/b-1.jpg'), largeImg: require('@/assets/images/b-1.jpg'), price: 28, desc: '换发出一种香甜芬芳'},

    ]},
  ],

  tempList: {
    t0: {data: [], endIndex: 0, isEnd: false},
    t1: {data: [], endIndex: 0, isEnd: false},
    t2: {data: [], endIndex: 0, isEnd: false},
    t3: {data: [], endIndex: 0, isEnd: false},
  }

}