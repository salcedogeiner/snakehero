function initGame() {
    // Obtén una referencia al elemento canvas
    const canvas = document.getElementById("gameCanvas");
    const context = canvas.getContext("2d");
    const canvasContainer = document.getElementById("canvasContainer");
    const scoreGame = document.getElementById("score");
    const lostCard = document.getElementById("lost");
    const totalScore = document.getElementById("total");

    // Establece el tamaño del lienzo
    canvas.width = canvasContainer.clientWidth - (canvasContainer.clientWidth % 10);
    canvas.height = canvasContainer.clientHeight - (canvasContainer.clientHeight % 10);

    let userDirection = 'right';
    let nodesDirection = ['right', 'right', 'right', 'right', 'right']

    // Función para establecer el color de fondo negro
    function clearCanvas() {
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    function hero(posx = 10, posy = 10) {
        this.position = { x: posx, y: posy };
        this.size = { x: 10, y: 10 };
        this.color = "white";
        this.direction = "right"; // right, left, up, down
        this.paint = function () {

            switch (this.direction) {
                case "up":
                    this.position.y -= 10; // Mueve el cuadro hacia arriba
                    break;
                case "down":
                    this.position.y += 10; // Mueve el cuadro hacia abajo
                    break;
                case "left":
                    this.position.x -= 10; // Mueve el cuadro hacia la izquierda
                    break;
                case "right":
                    this.position.x += 10; // Mueve el cuadro hacia la derecha
                    break;
            }

            if (this.position.x > canvas.width - 10) {
                this.position.x = 0;
            }
            if (this.position.x < 0) {
                this.position.x = canvas.width - 10;
            }
            if (this.position.y > canvas.height - 10) {
                this.position.y = 0;
            }
            if (this.position.y < 0) {
                this.position.y = canvas.height - 10;
            }
            context.fillStyle = this.color; // Color de las celdas
            context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
            context.strokeStyle = "black";
            context.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
        };
        this.move = function (direction) {
            this.direction = direction;
        }
        return this;
    }

    function mob(posx = 10, posy = 10) {
        this.position = { x: posx, y: posy };
        this.size = { x: 10, y: 10 };
        this.color = "white";
        this.paint = function () {
            context.fillStyle = getRandomColor(); // this.color; // Color de las celdas
            context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
            context.strokeStyle = "white";
            context.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
        };
        this.reposition = function () {
            let coordinates = getMobCoordinates()
            this.position = coordinates;
        }

    }

    function getMobCoordinates() {
        // Generar coordenadas aleatorias dentro del canvas
        const maxX = (canvas.width - 10) / 10;
        const maxY = (canvas.height - 10) / 10;

        const randomX = Math.floor(Math.random() * maxX) * 10;
        const randomY = Math.floor(Math.random() * maxY) * 10;

        return { x: randomX, y: randomY };
    }

    function checkColission() {
        const head = snake[0];
        if (head.position.x == seed.position.x && head.position.y == seed.position.y) {
            seed.reposition();
            const tail = snake[snake.length - 1]
            const posHero = { ...tail.position }
            switch (tail.direction) {
                case "up":
                    posHero.y += 10; // Mueve el cuadro hacia arriba
                    break;
                case "down":
                    posHero.y -= 10; // Mueve el cuadro hacia abajo
                    break;
                case "left":
                    posHero.x += 10; // Mueve el cuadro hacia la izquierda
                    break;
                case "right":
                    posHero.x -= 10; // Mueve el cuadro hacia la derecha
                    break;
            }
            const newHero = new hero(posHero.x, posHero.y)
            newHero.move(tail.direction);

            snake.push(newHero);
            nodesDirection.push(newHero.direction);
            scoreGame.innerText++;
            return true;
        }

        snake.forEach((el, idx) => {
            if (idx != 0 && el.position.x == snake[0].position.x && el.position.y == snake[0].position.y) {
                lostGame();              
            }
        })

        return true;
    }

    function getRandomColor() {
        const hex = "0123456789ABCDEF";
        let color = "#";

        for (let i = 0; i < 6; i++) {
            color += hex[Math.floor(Math.random() * 16)];
        }

        return color;
    }

    function lostGame(){
        clearInterval(refreshGame);        
        totalScore.innerText = scoreGame.innerText;
        lostCard.style.display = 'flex';
    }

    let coordinates = getMobCoordinates()
    const seed = new mob(coordinates.x, coordinates.y)


    const snake = [new hero(50, 10), new hero(40, 10), new hero(30, 10), new hero(20, 10), new hero(10, 10)];


    document.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "ArrowUp":
                userDirection = userDirection != "down" ? "up" : userDirection; // Mueve el cuadro hacia arriba
                break;
            case "ArrowDown":
                userDirection = userDirection != "up" ? "down" : userDirection; // Mueve el cuadro hacia abajo
                break;
            case "ArrowLeft":
                userDirection = userDirection != "right" ? "left" : userDirection; // Mueve el cuadro hacia la izquierda
                break;
            case "ArrowRight":
                userDirection = userDirection != "left" ? "right" : userDirection; // Mueve el cuadro hacia la derecha
                break;
        }

    });


    let refreshGame = setInterval(() => {
        nodesDirection.pop();
        nodesDirection.unshift(userDirection);
        clearCanvas();     
        checkColission();   
        snake.forEach((el, idx) => {
            el.move(nodesDirection[idx])
            el.paint()
        })
        seed.paint();
        
    }, 100);


}

var y = initGame()