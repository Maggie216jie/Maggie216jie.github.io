
function requestHandler (config){

  return new Promise( function(resolve, reject){

    var xhrRequest = new XMLHttpRequest();
    xhrRequest.open(config.method, config.url);
    xhrRequest.onload = function(e) {

      resolve(e.target.response);

    }


    xhrRequest.onreadystatechange = function() {
      if (xhrRequest.readyState == 4 && xhrRequest.status == 200) {

        if(config.num===1){

          console.log("config",config.num);

          document.getElementById('loading').classList.add('nodisplay');
          document.getElementById('maincontent').classList.remove('nodisplay');

        }


        if(config.num===2){

          console.log("config",config.num);

          document.getElementById('modalloading').classList.add('nodisplay');
          document.getElementById('modalload1').classList.remove('nodisplay');
          document.getElementById('modalload2').classList.remove('nodisplay');

        }


        




      }

    };



    xhrRequest.onerror = function () {

      reject(new Error('Something is wrong!'));
    }

    var body = config.method === 'POST' ? config.body :undefined;
    xhrRequest.send(body);
  })
}



var likemovies = [];
var likemoviesInfo = [];
var draglist=[];
var blocklist=[];
var blockmovieInfo = [];

   // window.onload = function(){

   // }

   function tabchange(){

    var currenttab =  document.getElementsByClassName('active')[0].getAttribute("id");

    if(currenttab=="defaultOpen"){

      document.getElementById('Popularmovie').classList.add('rotateout');
      setTimeout(function(b){
       openCity('likelisttab', 'Likedmovies');
       likemoviesdisplay();

     },1000);

    }else{

      openCity('likelisttab', 'Likedmovies');
      likemoviesdisplay();



    }







  }


  function closeModal(){




    var elementsmodal = document.getElementsByClassName('modallayer');


    for(var index=0; index<elementsmodal.length;index++){

      elementsmodal[index].setAttribute("style","dispaly:none");

    }

    document.getElementById('modalloading').classList.remove('nodisplay');
    document.getElementById('modalload1').classList.add('nodisplay');
    document.getElementById('modalload2').classList.add('nodisplay');
  }

    //begin of dispaly popular movies

    function requestPopularMovies(pagenum){




      var configPopular = {

        method: 'GET',
        num: 1,
        url: 'https://api.themoviedb.org/3/movie/popular?api_key=4bef8838c2fd078bd13d7127d8dedcd4&language=en-US&page='+pagenum
      }
      requestHandler(configPopular)
      .then(function(response){
        var firstrequest = JSON.parse(response);
            //var moviedatalist = firstrequest['results'];
          //  document.getElementById('loading').classList.add('nodisplay');
        //      document.getElementById('maincontent').classList.remove('nodisplay');
        showPopularMovies(firstrequest);


      })
      .catch(function(e){
        console.error(e);
      })


    }


    function requestModalMoviesInfo(idnum){

      console.log("begin requestModalMoviesInfo---------------------------");

      
      var idname = idnum;
      var configDetail = {

        method: 'GET',
        num: 2,
        url: 'https://api.themoviedb.org/3/movie/'+idname+'?api_key=4bef8838c2fd078bd13d7127d8dedcd4&language=en-US'
      }

      requestHandler(configDetail)
      .then(function(response){




        var modalmovieinfo = JSON.parse(response);
            //console.log(modalmovieinfo.id);

            var firstlayerimg = document.getElementsByClassName('backgraoudimg')[0];

            //console.log("firstlayerimg",firstlayerimg);


            var firstlayerimgsrc = "https://image.tmdb.org/t/p/w500"+ modalmovieinfo.backdrop_path;

            firstlayerimg.setAttribute("src",firstlayerimgsrc);
            var modalleftimg = document.getElementsByClassName('modalleftimg')[0];
            var modalleftimgsrc = "https://image.tmdb.org/t/p/w500"+ modalmovieinfo.poster_path;
            modalleftimg.setAttribute("src",modalleftimgsrc);
            var modaltitle = document.getElementsByClassName('modalmovietitle')[0];
            modaltitle.innerHTML= modalmovieinfo.original_title;

            var modaltype = document.getElementsByClassName('modalmovietype')[0];
            var typelist = modalmovieinfo.genres;
            var innertype ="";
            for (var i=0; i< typelist.length; i++){
              innertype+= "<span class=\"movietype\" style=\"background-color:"+getRandomColor()+"\">"+typelist[i].name+"</span>"
            }
            modaltype.innerHTML = innertype;

            var modaloverview = document.getElementsByClassName('modalmovieoverview')[0];
            modaloverview.innerHTML = "Overview:"+ modalmovieinfo.overview;

            var modalcompany = document.getElementsByClassName('modalmoviecompany')[0];
            var companylist = modalmovieinfo.production_companies;
            var innercompany ="";
            for(var i=0; i<companylist.length;i++){

              if(companylist[i].logo_path!=undefined && companylist[i].logo_path!=null){

                var logopath =  "https://image.tmdb.org/t/p/w500" + companylist[i].logo_path;
                innercompany += "<div class=\"companyimage\"><img src ="+logopath+"></div>";

              }else{

                innercompany += "<div class=\"companyname\">"+companylist[i].name+"</div>";
              }

            }

            modalcompany.innerHTML = innercompany;

          })

      .catch(function(e){
        console.error(e);
      })
    }


    var elementOpen = document.getElementById("defaultOpen");
    elementOpen.addEventListener("click", function(){

      openCity('defaultOpen', 'Popularmovie');
      var numpage = document.getElementById('Popularmovie').getAttribute("data-id");
      requestPopularMovies(numpage);

    });


    var elementOpenlike = document.getElementById("likelisttab");
    elementOpenlike.addEventListener("click", function(){

      tabchange();
      
    });

    var elementOpenblock = document.getElementById("blocktab");
    elementOpenblock.addEventListener("click", function(){

      openCity('blocktab', 'Blockmovies');
      showBlockMovies();
      
    });

    var elementOpenfinish = document.getElementById("configfinish");
    elementOpenfinish.addEventListener("click", function(){

      finish();

      
    });


    var elementOpenclose = document.getElementById("closemodalspan");
    elementOpenclose.addEventListener("click", function(){

      closeModal();

      
    });

    var elementOpencofig = document.getElementById("configtab");
    elementOpencofig.addEventListener("click", function(event){

      openCity('configtab', 'Config');
      dragInitial();clearparent(event.target);
      enableDragSort('drag-sort-enable')

      
    });


    function showPopularMovies(movielist1){

      console.log("begin showPopularMovies ---------------------------");

      document.getElementById('Popularmovie').classList.remove('rotaori');
      document.getElementById('Likedmovies').classList.add('rotatein');


     // console.log(movielist1);
     var movielist = movielist1['results'];
     document.getElementById('Popularmovie').classList.remove('rotateout');
     document.getElementsByClassName('config')[0].setAttribute("style","display:none;");
     if(document.getElementsByClassName('moviesgallery').length!==0){
      document.getElementsByClassName('moviesgallery')[0].remove();
    }



    var htmltext = "";

    htmltext = "<div class = \"paginationbar\"><button class = \"paginationbutton\" id = \"previouspage\">no more</button><p id = \"resultsummary\"></p><button class =\"paginationbutton\" id= \"nextpage\">next</button></div>";


    for(var i=0;i<movielist.length;i++){
      if(blocklist.indexOf(movielist[i].id)===-1){
        var ss="https://image.tmdb.org/t/p/w500"+movielist[i].poster_path;
        var release = moment(movielist[i].release_date).format('LL');
        var titlelist = movielist[i].title.split(" ");

        htmltext += "<div class = \"movieitem\" id=\"popularid-"+movielist[i].id+"\"><img class=\"clickimage\" src="+ss+"><h4>"+movielist[i].title+"</h4><p>"+release+"</p>";
        htmltext += "<div class=\"likeblock\"><a class=\"likeit\" onclick=\"getLikelist(this);\" data-id="+movielist[i].id+" data-img="+ss+" data-release="+movielist[i].release_date+" data-title="+titlelist.join("-")+">Like it!</a>"
        htmltext += "<a class=\"blockit\" onclick=\"getBlocklist(this);\" data-id="+movielist[i].id+" data-img="+ss+" data-release="+movielist[i].release_date+" data-title="+titlelist.join("-")+">Block it!</a></div></div>"


      }


    }

    var div = document.createElement('div');
    div.className = "moviesgallery";
    div.innerHTML = htmltext;
    document.getElementById('Popularmovie').appendChild(div);


    document.getElementById('resultsummary').innerText= "Page "+movielist1['page']+" / Total "+movielist1['total_pages']+" of "+movielist1['total_results']+" results";

    if(movielist1['page']!==1){

      document.getElementById('previouspage').innerText = "prev";
      document.getElementById('previouspage').addEventListener("click", function previouspage (){
        var pagenumber = movielist1['page']-1;
        requestPopularMovies(pagenumber);

        document.getElementById('Popularmovie').setAttribute("data-id",pagenumber);

      });

    }



    document.getElementById('nextpage').addEventListener("click", function nextpage(){

      var pagenumber = movielist1['page']+1;
      console.log("next",pagenumber);
      requestPopularMovies(pagenumber);

      document.getElementById('Popularmovie').setAttribute("data-id",pagenumber);

    });


    function showModalMovieDetail (event) {

      var modalelements = document.getElementsByClassName("modallayer");
      for(var i=0;i<modalelements.length;i++){
        modalelements[i].setAttribute("style","display:block")
      }

      var parentelement = event.target.parentElement;

      var modalidnum = parentelement.getAttribute('id').split("-")[1];

        //console.log(modalidnum);

        requestModalMoviesInfo(modalidnum);

      } 

      const characterList = document.querySelectorAll('.clickimage');

      for(var mindex=0; mindex<characterList.length;mindex++){
        characterList[mindex].addEventListener('click', showModalMovieDetail);
      }


      if(likemovies.length!==0){
        for(var i =0;i<likemovies.length;i++){
          var likeitelement = document.querySelectorAll('a[data-id=\"'+likemovies[i]+'\"]');
          for(var j=0;j<likeitelement.length;j++){
            if(likeitelement[j].getAttribute("class")=="likeit"){

              likeitelement[j].setAttribute("style","color:rgb(220,119,150);");


            }
          }

        }
      }

    }


    
    function getLikelist(d){

      console.log("begin getlikelist ---------------------------");
      
      if(likemovies.indexOf(parseInt(d.getAttribute("data-id")))!==-1){
        alert("add already");
        
      }else{
        likemovies.push(parseInt(d.getAttribute("data-id")));

        var objlikemovie = {

          "id": parseInt(d.getAttribute("data-id")),
          "img": d.getAttribute("data-img"),
          "title": d.getAttribute("data-title").split("-").join(" "),
          "release": d.getAttribute("data-release")

        }


        likemoviesInfo.push(objlikemovie);



        d.setAttribute("style","color:rgb(220,119,150);");
        if(likemovies.length === 1){

          var list, index;
          list = document.getElementsByClassName("likehidden");
          for (index = 0; index < list.length; ++index) {
            list[index].setAttribute("style","display:inline-block;");
          }
        }
        
        document.getElementById("suplike").textContent=likemovies.length;
        deleteBlock(d);
      }
    }
    
    function getBlocklist(d){

      console.log("begin getblocklist ---------------------------");
      
      if(blocklist.indexOf(parseInt(d.getAttribute("data-id")))!==-1){
        alert("block already");
        
      }else{

        blocklist.push(parseInt(d.getAttribute("data-id")));

        var objblockmovie = {

          "id": parseInt(d.getAttribute("data-id")),
          "img": d.getAttribute("data-img"),
          "title": d.getAttribute("data-title").split("-").join(" "),
          "release": d.getAttribute("data-release")

        }

        console.log(objblockmovie);

        blockmovieInfo.push(objblockmovie);

        d.setAttribute("style","color:rgb(220,119,150);");
        
        if(blocklist.length === 1){

          var list, index;
          list = document.getElementsByClassName("blockhidden");
          for (index = 0; index < list.length; ++index) {
            list[index].setAttribute("style","display:inline-block;");
            
          }
        }
        document.getElementById("supblock").textContent=blocklist.length;
        var idstring = "popularid-"+d.getAttribute("data-id");

        console.log("idstringd",idstring);
        document.getElementById(idstring).setAttribute("style","display:none;");
        if(draglist.indexOf(parseInt(d.getAttribute("data-id")))!==-1){
          draglist.splice(draglist.indexOf(parseInt(d.getAttribute("data-id"))),1);
          
        }
        
        if(likemovies.indexOf(parseInt(d.getAttribute("data-id")))!==-1){
          likemovies.splice(likemovies.indexOf(parseInt(d.getAttribute("data-id"))),1);



          if(document.getElementById("likeid-"+parseInt(d.getAttribute("data-id")))!=null){

            document.getElementById("likeid-"+parseInt(d.getAttribute("data-id"))).setAttribute("style","display:none");


          }


          if(document.getElementById("popularid-"+parseInt(d.getAttribute("data-id")))!=null){

            document.getElementById("popularid-"+parseInt(d.getAttribute("data-id"))).setAttribute("style","display:none");

          }

          //document.getElementById("popularid-"+parseInt(d.getAttribute("data-id"))).setAttribute("style","display:none")
        }
        
        document.getElementById("suplike").textContent=likemovies.length;

        if(likemovies.length==0){
          var likeelement = document.getElementsByClassName('likehidden');
          for (var index = 0; index < likeelement.length; ++index) {
            likeelement[index].setAttribute("style","display:none;");
          }
        }

      }
    }

    function likemoviesdisplay(){

      console.log("begin likemovie display ---------------------------");
      document.getElementsByClassName("tabcontent")[0].setAttribute("style","display:none");

      if(draglist.length<likemovies.length){
        for(var m =0; m<likemovies.length;m++){
          if(draglist.indexOf(likemovies[m])===-1){
            draglist.push(likemovies[m]);
          }
        }
      }
      
      document.getElementsByClassName('config')[0].setAttribute("style","display:inline-block;");
      document.getElementById('likemovie').innerHTML = "";

      for (var i=0; i< draglist.length; i++){

        var likemoviedetail = likemoviesInfo.filter(x => x.id == draglist[i])[0];
        var titlelist= likemoviedetail.title.split(" ")

        var div = document.createElement('div');
        div.className = "likeitem";
        div.id="likeid-"+likemoviedetail.id;
        div.innerHTML = "<img src="+likemoviedetail.img+"><h4 class=\"likemovieid\" data-id="+likemoviedetail.id+">"+likemoviedetail.title+"</h4><p>"+moment(likemoviedetail.release).format('LL')+"</p>"+"<div class=\"likeblock\"><a class=\"likeit\" onclick=\"getBlocklist(this);\" data-id="+likemoviedetail.id+" data-img="+likemoviedetail.img+" data-release="+likemoviedetail.release+" data-title="+titlelist.join("-")+">Block it!</a><a class=\"deleteblockit\" onclick=\"deleteLike(this);\" data-id="+likemoviedetail.id+">Delete</a></div>";
        document.getElementById('likemovie').appendChild(div);
      }


    }
    
    function showBlockMovies(){
      document.getElementsByClassName('config')[0].setAttribute("style","display:none;");
      if(document.getElementsByClassName('blockmoviesgallery').length!==0){
        document.getElementsByClassName('blockmoviesgallery')[0].remove();
        
      }
      var htmltext = "";
      
      for(var i=0;i<blocklist.length;i++){
        var blockmovie = blockmovieInfo.filter(x => x.id == blocklist[i])[0];
        var titlelist = blockmovie.title.split(" ");

        htmltext += "<div class = \"movieitem\" id=\"blockid"+blockmovie.id+"\"><img src="+blockmovie.img+"><h4>"+blockmovie.title+"</h4><p>"+moment(blockmovie.release).format('LL')+"</p>";
        htmltext += "<div class=\"likeblock\"><a class=\"likeit\" onclick=\"getLikelist(this);\" data-id="+blockmovie.id+" data-img="+blockmovie.img+" data-release="+blockmovie.release+" data-title="+titlelist.join("-")+">Like it!</a>"
        htmltext += "<a class=\"deleteblockit\" onclick=\"deleteBlock(this);\" data-id="+blockmovie.id+">Delete</a></div></div>"
      }
      
      var div = document.createElement('div');
      div.className = "blockmoviesgallery";
      div.innerHTML = htmltext;
      document.getElementById('Blockmovies').appendChild(div);
    }


    function deleteLike(d){

      console.log("begin deleteLike-----------");

      if(draglist.indexOf(parseInt(d.getAttribute("data-id")))!==-1){

       draglist.splice(draglist.indexOf(parseInt(d.getAttribute("data-id"))),1);
     }

     if(likemovies.indexOf(parseInt(d.getAttribute("data-id")))!==-1){
      likemovies.splice(likemovies.indexOf(parseInt(d.getAttribute("data-id"))),1);       
      var idstring = "likeid-"+d.getAttribute("data-id");
      document.getElementById(idstring).setAttribute("style","display:none;");
      document.getElementById("suplike").textContent=likemovies.length;
    }

    if(likemovies.length==0){
      console.log("likemovies length is 0");
      var likelement = document.getElementsByClassName('likehidden');
      for (var index = 0; index < likelement.length; ++index) {
        likelement[index].setAttribute("style","display:none;");
      }

      //document.getElementById("likelisttab").click();

    }
  }


  function deleteBlock(d){

    console.log("begin deleteblock---------------------------");

    if(blocklist.indexOf(parseInt(d.getAttribute("data-id")))!==-1){
      blocklist.splice(blocklist.indexOf(parseInt(d.getAttribute("data-id"))),1);

      var idstring = "blockid"+d.getAttribute("data-id");
      document.getElementById(idstring).setAttribute("style","display:none;");
      document.getElementById("supblock").textContent=blocklist.length;
    }

    if(blocklist.length==0){
      console.log("blocklist length is 0");
      var blockelement = document.getElementsByClassName('blockhidden');
      for (var index = 0; index < blockelement.length; ++index) {
        blockelement[index].setAttribute("style","display:none;");
      }

      //document.getElementById("likelisttab").click();

    }
  }

  function clearparent(el){
    el.parentElement.style.display='none';
  }


  var dragidtitle ={};

  function dragInitial(){

    document.getElementsByClassName('drag-sort-enable')[0].innerHTML = "";

    var likemovielement = document.getElementsByClassName('likemovieid');

      /*for(var i =0; i<likemovielement.length;i++){
        var lielement = document.createElement('li');

        lielement.innerHTML = likemovielement[i].innerText;
        dragidtitle[likemovielement[i].innerText] = parseInt( likemovielement[i].getAttribute("data-id"));
        document.getElementsByClassName('drag-sort-enable')[0].appendChild(lielement);

      }*/


      for(var i =0; i<draglist.length;i++){



        var likemoviedetail = likemoviesInfo.filter(x => x.id == draglist[i])[0];
        var lielement = document.createElement('li');

        lielement.innerHTML = likemoviedetail.title;
        console.log(lielement.innerHTML);
        dragidtitle[likemoviedetail.title] =  parseInt(likemoviedetail.id);

        document.getElementsByClassName('drag-sort-enable')[0].appendChild(lielement);



      }



    }
    
    function finish(){

      console.log("begin finish drag ---------------------------");
      
      var list2;
      list2 = document.getElementsByTagName("ul");

      var draglisttemp = list2[0].innerText.split("\n");

      draglist=[];

      for(var n=0; n<draglisttemp.length;n++){

        draglist.push( parseInt(dragidtitle[draglisttemp[n]]));
        
      }
      
      var list1, index1;
      list1 = document.getElementsByClassName("tab");
      for (index1 = 0; index1 < list1.length; ++index1) {
        list1[index1].setAttribute("style","display:block;");
      }

      openCity('likelisttab', 'Likedmovies');
      likemoviesdisplay();
      
      
    }


    function getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
    

    function openCity(idname, cityName) {


      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      
      document.getElementById(cityName).style.display = "block";
      document.getElementById(idname).classList.add('active');

      
    }
    
    document.getElementById("defaultOpen").click();


    function enableDragSort(listClass) {
      const sortableLists = document.getElementsByClassName(listClass);
      Array.prototype.map.call(sortableLists, (list) => {enableDragList(list)});
    }
    
    function enableDragList(list) {
      Array.prototype.map.call(list.children, (item) => {enableDragItem(item)});
    }
    
    function enableDragItem(item) {
      item.setAttribute('draggable', true);
      item.ondrag = handleDrag;
      item.ondragend = handleDrop;
    }
    
    function handleDrag(item) {
      const selectedItem = item.target,
      list = selectedItem.parentNode,
      x = event.clientX,
      y = event.clientY;
      
      selectedItem.classList.add('drag-sort-active');
      let swapItem = document.elementFromPoint(x, y) === null ? selectedItem : document.elementFromPoint(x, y);
      if (list === swapItem.parentNode) {
        swapItem = swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling;
        list.insertBefore(selectedItem, swapItem);
      }
    }
    
    function handleDrop(item) {
      item.target.classList.remove('drag-sort-active');
    }

