let bord = {
    brightness: 220,
    radiusMin: 0,
    radiusMax: [100,150],
    progress: 1,
    count: 0, // Всего запущено пузырей
    click: 0, // Всего кликов
    strike: 0, // Всего попаданий
    bubles:[]
}

window.onload = function(){
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.addEventListener('click', function(e) {
        let x = e.pageX, y = e.pageY;
        bord.bubles.reverse().forEach((n,i,arr) => {
            let r = n[2];
            let beforeX = n[0] - r;
            let afterX = n[0] + r;
            let beforeY = n[1] - r;
            let afterY = n[1] + r;
            if(x > beforeX && x < afterX && y > beforeY && y < afterY){
                arr.splice(i,1);
                var audio = new Audio('./sound/cartoon-bubble-pop.mp3');
                audio.play();
                bord.strike++;
            }
        })
        bord.click++;
    }, false);

    setInterval( function() { draw(canvas, bord) }, 1000/24);
    setInterval( function() { addBuble() }, 2000 );
}

function draw(canvas, bord){
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bord.bubles.forEach((n,i,arr) => {
        if(n[2] <= n[4])
            arr[i][2] += bord.progress;
        else
            arr.splice(i,1);
    })

    bord.bubles.forEach(n => {
        let [x,y,r,color] = n;
        drawCircle(ctx,x,y,r,color);
    });

    updateScore(bord);
}

function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    if (fill) {
      ctx.fillStyle = fill
      ctx.fill()
    }
    if (stroke) {
      ctx.lineWidth = strokeWidth
      ctx.strokeStyle = stroke
      ctx.stroke()
    }
}

function addBuble(){
    let x = getRandomInt(window.innerWidth);
    let y = getRandomInt(window.innerHeight);
    let r = bord.radiusMin;
    let rMax = getRandomArbitrary(bord.radiusMax[0], bord.radiusMax[1]);
    let color = randomColor(bord.brightness);
    bord.bubles.push([x,y,r,color,rMax]);
    bord.count++;
}

function randomColor(brightness){
    function randomChannel(brightness){
      var r = 255-brightness;
      var n = 0|((Math.random() * r) + brightness);
      var s = n.toString(16);
      return (s.length==1) ? '0'+s : s;
    }
    return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function updateScore(bord){
    let {count,click,strike} = bord;
    let countDiv = document.querySelector('.count');
    let clickDiv = document.querySelector('.click');
    let strikeDiv = document.querySelector('.strike');
    let percentDiv = document.querySelector('.percent');

    let kda = Math.floor(strike/(click/100));

    countDiv.innerHTML = count;
    clickDiv.innerHTML = click;
    strikeDiv.innerHTML = strike;
    percentDiv.innerHTML = kda > 0 ? kda + '%' : 0;
}