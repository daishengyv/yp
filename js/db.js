let db = {
    '0':{
        id:0,
        name:'全部文件'
    },
    '1':{
        id:1,
        pId:0,
        name:'电影123456'
    },
    '2':{
        id:2,
        pId:0,
        name:'音乐'
    },
    '3':{
        id:3,
        pId:1,
        name:'枪战'
    },
    '4':{
        id:4,
        pId:1,
        name:'wuda'
    },
    '5':{
        id:5,
        pId:2,
        name:'zjl'
    },
    '6':{
        id:6,
        pId:2,
        name:'cyx'
    }
}
const dbData = db;
const imgData = [
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg',
    'img/6.jpg',
    'img/7.jpg',
    'img/8.jpg',
    'img/9.jpg'
]
//本地存储
// localStorage.clear();

// function localSet(){
//     localStorage.setItem('dg',JSON.stringify(db));
//     db = JSON.parse(localStorage.getItem('dg'));
// }
// localStorage.setItem('dg',JSON.stringify(db));
if(localStorage.length){
    db = JSON.parse(localStorage.getItem('dg'));
}
function localStorageDG(db){
    localStorage.setItem('dg',JSON.stringify(db));
}


//---------------db 相关函数----------------------
//根据id获取指定的数据
function getItemById(db,id){
    return db[id];
}
//根据id设置指定的数据
function setItemById(db,id,data){//data {name:newName}
    const item = db[id];
    // for(let key in data){
    //     item[key] = data[key];
    // }
    return item && Object.assign(item,data); //合并对象里面的属性（总的，新加的）
}
//根据id获取当前所有的文件夹
function getChildrenById(db,id){
    const data = [];
    for(let key in db){
        const item = db[key];
        if(item.pId == id){
            data.push(item);
        }
    }
    return data;
}
//判断名字是否可以
function nameCanUse(db, id, text){
    const currentData = getChildrenById(db, id);
    return currentData.every(item => item.name !== text);
  }
//根据指定id删除对应数据以及它的所有子集
function deleteItemById(db,id){
    if(!id) return false;
    delete db[id];
    let children = getChildrenById(db,id);
    let len = children.length;
    if(len){
        for(let i=0; i<len; i++){
            deleteItemById(db, children[i].id);
        }
    }
    return true;
}
//判断文件是否可以移动
function canMoveData(db, currentId, targetId){
    const currentData = db[currentId];
    const targetParents = getAllParents(db, targetId);

    if(currentData.pId == targetId){
      return 2; // 移动到自己所在的目录
    }
    if(targetParents.indexOf(currentData) !== -1){
      return 3;   // 移动到自己的子集
    }
    if(!nameCanUse(db, targetId, currentData.name)){
      return 4; // 名字冲突
    }
    return 1;
  }
//移动数据
function moveDataTarget(db,currentId,targetId){
    db[currentId].pId = targetId;
}
//找元素所有父级
function getAllParents(db,id){
    let data = [];
    const current = db[id];
    if(current){
        data.push(current);
        data = getAllParents(db,current.pId).concat(data);
    }
    return data;
}
//将缓存元素转成数组
function getCheckedFileContent(checkedBuffer){
    let data = [];
    for(let key in checkedBuffer){
        if(key !== 'length'){
            const currentItem = checkedBuffer[key];
            data.push({
                fileId:parseFloat(key),
                fileNode:currentItem
            });
        }
    }
    return data;
}