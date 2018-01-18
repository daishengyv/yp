//对象定义全局变量
const wy = {
    fileParent:document.getElementById('fileParent'),       //所有文件夹的父级
    files:document.getElementById('fileParent').children,  //所有文件夹
    crumbs:document.getElementById('crumbs'),             //面包屑导航父级
    header:document.getElementById('header'),            //头部父级
    cMain:document.getElementById('content-main'),      //主要内容头部
    checkAllBtn:document.getElementById('checkAllBtn'),//全选按钮
    rechristen:document.getElementById('rechristen'),//重命名按钮
    deleteBtn:document.getElementById('deleteBtn'), //删除按钮
    newFileBtn:document.getElementById('newFileBtn'),//新建文件夹按钮
    movefileBtn:document.getElementById('movefileBtn'),//移动到按钮
    moveParent:document.getElementById('moveParent'),//移动的父级
    moveFileMain:document.getElementById('moveFileMain'),//移动界面主体
    moveItem:0,                                         //移动的元素
    moveTarget:0,                                     //要移动到的目标
    moveTargetId:0,                                     //要移动到的目标的id
    moveCancel1:document.getElementById('move-cancel1'),//取消移动
    moveCancel:document.getElementById('move-cancel'),//取消移动
    moveSure:document.getElementById('move-sure'),//确定移动
    moveNew:document.getElementById('move-new'), //
    refurbishBtn:document.getElementById('refurbishBtn'),//刷新按钮
    createFNname:null,                                   //新建文件夹名字
    mainSwitch:false,                               //总开关
    fileItems:{length:0},                          //选中的文件夹
    tooltipA:document.getElementById('tooltipA'), //提示框元素
    tooltipASure:document.getElementById('tooltipA-sure'),//确定提示信息
    tooltipACancel:document.getElementById('tooltipA-cancel'),//取消提示信息
    caseSelect:document.getElementById('caseSelect'), //画框
    bgImg:document.getElementById('bgImg'),//设置背景
    currentListId:0,
}


//初始化
intoFolder(wy.currentListId);

//------------------父级委托事件---------------------------------
//刷新
wy.refurbishBtn.addEventListener('click',function (e){
    localStorage.clear();
    db = dbData;
    localStorage.setItem('dg',JSON.stringify(dbData));
        document.body.style['background-image'] = 'none';
    setTimeout(function (){
        document.body.style['background-image'] = '';
    },20)

    intoFolder(0);
})
//单击cMain的子集
wy.cMain.addEventListener('click',function (e){
    abolishNameFn(e);  //取消重命名
    confirmNameFn(e); //确定重命名
    textPPFn(e);
    if(wy.mainSwitch) return;

    selectAll(e);     //全选
    rechristenFn(e); //重命名
    deleteFn(e);    //删除
    newFileFn(e);  //新建文件夹
    // moveFileFn(e);//移动到
})
//点击crumbs的子集进行文档切换 
wy.crumbs.addEventListener('click',function (e){
    if(wy.mainSwitch) return;
    const target = e.target;
    if(target.fileId !== undefined  && wy.currentListId !== target.fileId){
        intoFolder(wy.currentListId = target.fileId);
    }
    //返回上一级
    if(target == wy.crumbs.firstElementChild && wy.currentListId > 0){
        const current = wy.crumbs.lastElementChild.lastElementChild.previousElementSibling.previousElementSibling.fileId;
        intoFolder(wy.currentListId = current);
    }
});
//画框
var x,y;
document.addEventListener('mousedown',function (e){
    e.preventDefault();
    x = e.pageX, y = e.pageY;
    if(e.target.id !== 'fileParent') return;
    document.addEventListener('mousemove',selectBox);
    document.addEventListener('mouseup',cancelSelectBox);
})

function selectBox(e){
    if(e.pageY < wy.fileParent.offsetTop || e.pageX < wy.fileParent.offsetLeft){
        cancelSelectBox();
        return;
    }

    let onOff;
    wy. caseSelect.style.left = (Math.min(x,e.pageX)) + 'px';
    wy. caseSelect.style.top = (Math.min(y,e.pageY)) + 'px';
    wy. caseSelect.style.width =(Math.abs(x - e.pageX)) + 'px';
    wy. caseSelect.style.height =(Math.abs(y - e.pageY)) + 'px';

    for(var i=0;i<wy.files.length;i++){
        let swit = wy.files[i].classList.contains('checked');

        onOff = wy.files[i].classList.toggle('checked',duang(wy.caseSelect,wy.files[i]));
        if(onOff){
            if(!swit){
            wy.fileItems[wy.files[i].fileId] = wy.files[i];
            wy.fileItems.length++;}
        }else{
            if(swit){
                delete wy.fileItems[wy.files[i].fileId];
                wy.fileItems.length--;
            }
        }
        wy.checkAllBtn.classList.toggle('checked',wy.fileItems.length == wy.files.length);
}

} 
function cancelSelectBox(){
    document.removeEventListener('mousemove',selectBox);
    document.removeEventListener('mouseup',selectBox);
    wy.caseSelect.style = '';
}

// fileParent单击file进入文件夹
wy.fileParent.addEventListener('click',function (e){
    if(wy.mainSwitch) return;
    const target = e.target;
    if(target.classList.contains('file') || target.classList.contains('icon') || target.nodeName === 'IMG'){
        intoFolder(wy.currentListId = target.fileId);
    }
    console.log(wy.currentListId);
   
    selectItem(e);
 
});
//----------------------------功能函数---------------------
//进入新界面
function intoFolder(current){
    createFileNode(db,current);
    createCrumbs(db,current);

    wy.crumbs.firstElementChild.style.display = current > 0 ? 'inline-block' : '' ;
    wy.fileItems = {length:0};
    wy.checkAllBtn.classList.remove('checked');
}
//生成文档内容
function createFileNode(db,id){
    wy.fileParent.innerHTML = '';
    for(let key in db){
        if(db[key].pId == id){
            wy.fileParent.appendChild(createFile(key));                  
        }
    }
    fileEmpty();
}
//生成一个file结构
function createFile(key,name){
    const file = document.createElement('div');
    file.classList.add('file');
    file.innerHTML = `<div class="select">✔</div>
                      <div class="icon"><img src="images/file.png"></div>
                      <span class="name">${name || db[key].name}</span>
                     <div class='rename'><input type="text"><span class='confirmName'>√</span><span class='abolishName'>×</span></div>`;
    file.fileId = file.querySelector('img').fileId = key;
    file.child = file.children;
    [...file.child].forEach(function (item,i){
       item.fileId = key;
    });     
    return file;
}
//生成面包屑内容
function createCrumbs(db,id){
    const data = getAllParents(db,id);
    const crumbsSpan = wy.crumbs.querySelector('span');
    crumbsSpan.innerHTML ='';
    for(let i=0;i< data.length;i++){
        const a = document.createElement('a');
        const ii = document.createElement('i');
        a.fileId = data[i].id;
        a.innerHTML = data[i].name;
        a.href = 'javascript:;';
        a.style['max-width'] = '90px';
        a.style['text-overflow'] = 'ellipsis';
        a.style['word-break'] = 'break-all';
        a.style.height = '14px';
        ii.innerHTML = '>';
        crumbsSpan.appendChild(ii);
        crumbsSpan.appendChild(a);
    }
}

//----------选中file
function selectItem(e){
    const target = e.target;
    if(target.className !== 'select') return;
    const onOff = target.parentNode.classList.toggle('checked');


    if(onOff){
        wy.fileItems[target.parentNode.fileId] = target.parentNode;
        wy.fileItems.length++;
    }else{
        delete wy.fileItems[target.parentNode.fileId];
        wy.fileItems.length--;
    }
    wy.checkAllBtn.classList.toggle('checked',wy.fileItems.length == wy.files.length);
}
//----------全部选中
function selectAll(e){
    if(e.target.id !== 'checkAllBtn') return;
  
    const onOff = e.target.classList.toggle('checked');

    Array.from(wy.files).forEach(function (item){
        item.classList.toggle('checked',onOff);
        if(onOff){
            wy.fileItems[item.fileId] = item;
        }else{
            wy.fileItems = {length:0};
        }
    });
    wy.fileItems.length = onOff ? wy.files.length : 0;
}
//------------重命名 
function rechristenFn(e){//点击重命名
    if( e.target.id !== 'rechristen' || wy.fileItems.length !== 1) return;
    reNameFn();
}
function reNameFn(){
    let item;
    for(let key in wy.fileItems){
        if(key !== 'length'){
           item = wy.fileItems[key];
        }
    }
    const target = item.lastElementChild;
    wy.mainSwitch = true;

    wy.tooltipA.nextElementSibling.classList.add('show');
    wy.tooltipA.nextElementSibling.style.background = 'none';

    target.classList.toggle('checked');
    target.firstElementChild.value = item.lastElementChild.previousElementSibling.innerHTML;
    target.firstElementChild.focus();
    target.firstElementChild.select();

}
function textPPFn(e){//取消重命名
    if(!e.target.parentNode) return;
    if(e.target.nodeName !== 'INPUT' || !e.target.parentNode.classList.contains('checked')) return;
   console.log(123);
}
function abolishNameFn(e){//取消重命名
    if(!e.target.parentNode) return;
    if(e.target.className !== 'abolishName' || !e.target.parentNode.classList.contains('checked')) return;
    e.target.parentNode.classList.toggle('checked');
    wy.mainSwitch  = false;

    setTimeout(function (){
        wy.tooltipA.nextElementSibling.classList.remove('show');
        wy.tooltipA.nextElementSibling.style.background = '';
    },1000);

    if(wy.createFNname){
        wy.fileParent.removeChild(wy.createFNname);
        delete db[wy.createFNname.fileId];
        wy.fileItems = {length:0};
        wy.createFNname = null;
        fileEmpty();
        tooltipFn('ts',true,'取消新建');
    }else{
        tooltipFn('ts',true,'取消命名');
    }
}
function confirmNameFn(e){//确定重命名
    if(!e.target.parentNode) return;
    if(e.target.className !== 'confirmName' || !e.target.parentNode.classList.contains('checked')) return;
    wy.createFNname = null;
    const item = e.target.previousElementSibling;
    const id = e.target.parentNode.fileId;
    let newName = e.target.previousElementSibling.value.trim();
    if(!newName){
        tooltipFn('ts',true,'请输入名字');
        return;
    }
    if(newName == item.parentNode.previousElementSibling.innerHTML){
        e.target.parentNode.classList.toggle('checked');
        wy.mainSwitch  = false;
        wy.tooltipA.nextElementSibling.classList.remove('show');
        wy.tooltipA.nextElementSibling.style.background = '';
        localStorageDG(db);
        return;
    }
    if(!nameCanUse(db,wy.currentListId,newName)){
        tooltipFn('ts',true,'名字已存在');
        return;
    }
    item.focus();
    item.parentNode.previousElementSibling.innerHTML = newName;

    e.target.parentNode.classList.toggle('checked');
    wy.mainSwitch  = false;
    wy.tooltipA.nextElementSibling.classList.remove('show');
    wy.tooltipA.nextElementSibling.style.background = '';
    setItemById(db,e.target.parentNode.fileId,{name:newName});
    localStorageDG(db);
}
//-----------删除
function deleteFn(e){
    if(e.target.id !== 'deleteBtn'  || wy.fileItems.length <= 0) return;
    tooltipFn('aaa',true,'确定删除文件吗');
   
    wy.tooltipASure.onclick = function (){
        const data = getCheckedFileContent(wy.fileItems);
        data.forEach(function (item){
            wy.fileParent.removeChild(item.fileNode);
            deleteItemById(db,item.fileId);
        })
        wy.fileItems = {length:0};
        fileEmpty();
        wy.tooltipASure.onclick = null;
        localStorageDG(db);
        return  tooltipFn('aaa',false,'好的');
    };
    wy.tooltipACancel.onclick = function (){
        wy.tooltipACancel.onclick = null;
        return  tooltipFn('aaa',false,'好滴好滴');
    };
}
//--------------新建文件夹
function newFileFn(e){
    if(e.target.id !== 'newFileBtn') return;
    fileEmpty(true);

    const time = Date.now();
    wy.fileItems = {length:0};
    let num = 0;
    Array.from(wy.files).forEach(function (item){
        item.classList.remove('checked');
    });

    const data = getChildrenById(db,wy.currentListId);
    data.forEach(function (item){
        console.log(item.name.substr(0,5) == '新建文件夹');
        if(item.name.substr(0,5) == '新建文件夹'){
            num++;
        }
    });
    if(!num){num = '';}

    const file = createFile(time,`新建文件夹${num}`)

    file.classList.add('checked');
    wy.fileParent.insertBefore(file,wy.fileParent.firstElementChild);  

    wy.fileItems[time] = file;
    wy.fileItems.length++;
    db[time] = {id:time,pId:wy.currentListId,name:`新建文件夹${num}`};
    wy.createFNname = file;
    reNameFn();
}
//------------移动到
wy.movefileBtn.addEventListener('click',function (e){
    if(wy.fileItems.length == 0){
        tooltipFn('ts',true,'请选择文件');
    }else{
        wy.moveFileMain.innerHTML = createTreeList(db,wy.currentListId);
        wy.moveFileMain.parentNode.classList.add('show');
        wy.tooltipA.nextElementSibling.classList.add('show');
        wy.moveTarget = wy.moveFileMain.firstElementChild.firstElementChild.firstElementChild;
    }
});

wy.moveParent.addEventListener('click', function (e){
    const item = e.target;
    //取消移动
    if(item .id === 'move-cancel' || item .id === 'move-cancel1'){
        wy.moveFileMain.parentNode.classList.remove('show');
        wy.tooltipA.nextElementSibling.classList.remove('show');
        wy.moveTargetId = 0;
    }
    //确定移动
    if(item .id === 'move-sure'){
        const moveId = [], moveItem = [];
        getCheckedFileContent(wy.fileItems).forEach(function (item){
            moveId.push(item.fileId);
            moveItem.push(item.fileNode);
        })
      
        for(let i=0;i<moveId.length;i++){
            let index = canMoveData(db,moveId[i],wy.moveTargetId);
            console.log(index,wy.moveTargetId);
            if(index === 2){
                return tooltipFn('ts',true,'已在本目录');
            }
            if(index === 3){
                return tooltipFn('ts',true,'不能移到子集');
            }
            if(index === 4){
                return tooltipFn('ts',true,'存在相同名字');
            }
        }
        for(let i=0;i<moveId.length;i++){
            wy.fileParent.removeChild(moveItem[i]);
            moveDataTarget(db,moveId[i],wy.moveTargetId);
        }
        wy.moveFileMain.parentNode.classList.remove('show');
        wy.tooltipA.nextElementSibling.classList.remove('show');
        wy.moveTargetId = 0;
        wy.fileItems = {length:0};
        localStorageDG(db);
        fileEmpty();
    }
});

wy.moveFileMain.addEventListener('click',function (e){
    const item = e.target;
    //点击dfn
    if(item .nodeName === 'DFN'){
        item.classList.toggle('active');
        [...item.parentNode.parentNode.children].slice(1).forEach(function (item){
            item.style.display = !item.classList.contains('active') && item.style.display === '' ?  'none' : '';
        })
    }
    if(item.nodeName === 'DIV'){
        wy.moveTarget.classList.remove('active');
        item.classList.add('active');
        wy.moveTarget = item;
        wy.moveTargetId = item.dataset.fileId;
    }else{
        wy.moveTarget.classList.remove('active');
        item.parentNode.classList.add('active');
        wy.moveTarget = item.parentNode;
        wy.moveTargetId = item.parentNode.dataset.fileId;
    }
    console.log(wy.moveTarget,wy.moveTargetId);
});
//生成移动列表
function createTreeList(db,currentListId,id = 0){
    const data = db[id];
    const floorIndex = getAllParents(db,id).length;
    const children = getChildrenById(db,id);
    const len = children.length;

    let str = `<ul class="treeview" style = display:''>`; 
    str += `<li>
        <div data-file-id = '${data.id}' style = 'padding-left:${(floorIndex-1)*32}px'   class=${id == currentListId?'active':''}   ><dfn class=${len>0?'active':''}></dfn><span data-file-id = '${data.id}'>${db[id].name}</span></div>`;
    if(len){
        for(let i=0;i<len;i++){
            str += createTreeList(db,0,children[i].id);
        }
    }
    return str += `</li></ul>`;
}
//-----------------------------工具函数---------------------
//提示框函数
function tooltipFn(cls,onOff,value){
    console.log(tooltipFn.timer);
    if(tooltipFn.timer) value = '放我回去';
    clearTimeout(tooltipFn.timer);
    if(cls === 'ts'){
        wy.tooltipA.classList.add('ts');
        tooltipFn.timer = setTimeout(function (){
            wy.tooltipA.classList.remove('ts');
            tooltipFn.timer = null;
        },1200);
    }else{
        wy.tooltipA.classList.toggle('show',onOff);
        wy.tooltipA.nextElementSibling.classList.toggle('show',onOff);
    }
    wy.tooltipA.firstElementChild.innerHTML = value;
}
//文件夹是空时提醒
function fileEmpty(onOff){
    if(wy.fileParent.innerHTML === ''){
        wy.fileParent.classList.add('empty');
        wy.fileParent.innerHTML = `<div id='emptyKong11'>您还没有上传过文件哦，点击<a href='javascript:;'> 上传 </a>按钮~</div>`;
        wy.checkAllBtn.parentNode.classList.add('hidden');
    }else{
        if( wy.fileParent.classList.contains('empty')){
            wy.fileParent.classList.remove('empty');
            wy.checkAllBtn.parentNode.classList.remove('hidden');

            if(onOff){
                 wy.fileParent.innerHTML = '';
                 wy.checkAllBtn.classList.add('checked');
                }
        }else{
            wy.checkAllBtn.classList.remove('checked');
        }
    }
}
//-----------------------------辅助功能---------------------
//换背景
const setBgImg = document.getElementById('setBgImg');
const bgImg = document.getElementById('bgImg');
setBgImg.onclick = function (){
    bgImg.style.display = 'block';
}
for(let i=0;i<imgData.length;i++){
    bgImg.innerHTML += ` <img src=${imgData[i]} data-img-id = ${imgData[i]} >`;
}
bgImg.innerHTML += '<button>退出</button>';
wy.bgImg.addEventListener('click', function (e){
    if(e.target.nodeName !== 'IMG'){
        bgImg.style.display = '';
        return;
    }
    document.body.style['background-image'] = 'url('+ e.target.dataset.imgId + ')';
})
