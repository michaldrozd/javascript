// The process of evolution through simple animals, rendered as small circles, as they search for and consume food represented by small triangles.

let canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
let ctx = canvas.getContext('2d');
let food = [];
let animals = [];

function Animal(x, y, r, color) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    this.speed = Math.random() * 2 + 1;
    this.angle = Math.random() * 2 * Math.PI;
}

Animal.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
};
Animal.prototype.move = function () {
    let distance;
    let i;
    let dx = Math.cos(this.angle) * this.speed;
    let dy = Math.sin(this.angle) * this.speed;
    if (this.x + dx < 0 || this.x + dx > canvas.width) {
        this.angle = Math.PI - this.angle;
    }
    if (this.y + dy < 0 || this.y + dy > canvas.height) {
        this.angle = -this.angle;
    }

    // If there is any bigger animal around try to escape as possible
    let escape = false;
    for (i = 0; i < animals.length; i++) {
        distance = dist(this, animals[i]);
        if (distance < this.r + animals[i].r && this.r < animals[i].r) {
            this.angle += Math.PI;
            dx += 5;
            dy += 5;
            escape = true;
            break;
        }
    }

    if (!escape) {
        let closestFood = null;
        let closestDistance = Infinity;
        for (i = 0; i < food.length; i++) {
            distance = dist(this, food[i]);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestFood = food[i];
            }
        }

        if (closestFood != null) {
            this.angle = Math.atan2(closestFood.y - this.y, closestFood.x - this.x);
        }
        // If there is no close food then go and search it somewhere
        if (closestFood == null) {
            this.angle += Math.random() * 0.5 - 0.25;
        }
    }

    this.x += dx;
    this.y += dy;
};
Animal.prototype.eat = function () {
    let i;
    let distance;
    for (i = 0; i < food.length; i++) {
        distance = dist(this, food[i]);
        if (distance < this.r + food[i].r) {
            food[i] = new Food(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 10 + 5);
            return true;
        }
    }
    // Animal can also eat another weaker/smaller animal, then it gain half of his size!
    for (i = 0; i < animals.length; i++) {
        distance = dist(this, animals[i]);
        if (distance < this.r + animals[i].r && this.r > animals[i].r) {
            this.angle += Math.PI;
        }
        if (distance < this.r + animals[i].r && this.r > animals[i].r) {
            this.r += animals[i].r / 2; // gain half of his size!
            animals.splice(i, 1); // remove the eaten animal from the array!
            return true;
        }
    }
    return false;
};

function Food(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;

    const colorR = Math.floor(Math.random() * 255);
    const colorG = Math.floor(Math.random() * 255);
    const colorB = Math.floor(Math.random() * 255);

    this.color = 'rgb(' + colorR + ', ' + colorG + ', ' + colorB + ')'; // random color! :)

    if (Math.random() > 0.5) { // 50% chance to turn right or left? random! :)
        this.color = 'rgb(' + colorR + ', ' + colorG + ', ' + colorB + ')';
    } else {
        this.color = 'rgb(' + colorR + ', ' + colorG + ', ' + colorB + ')';
    }
}

Food.prototype.draw = function () {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.r); // top point of the triangle

    ctx.lineTo(this.x - 2 / 3 * this.r, this.y + this.r); // left point of the triangle

    ctx.lineTo(this.x + 2 / 3 * this.r, this.y + this.r); // right point of the triangle

    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
};

function dist(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

function draw() {
    let i;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (i = 0; i < food.length; i++) {
        food[i].draw();
    }

    for (i = 0; i < animals.length; i++) {
        animals[i].draw();
        animals[i].move();

        if (animals[i].eat()) {
            if (animals[i]) {
                // If the animal ate food make it slightly bigger!
                animals[i].r += 0.5;
            }
        }

        if (animals[i] && animals[i].r > 20) {
            // If the animal is big enough, it can reproduce!
            /* animals.push(new Animal(animals[i].x, animals[i].y, animals[i].r / 2, animals[i].color)) */
        }
    }
// If there is only one animal then this animal is winner and stop program
    if (animals.length === 1) {
        // write to circle text winner
        ctx.font = "30px Arial";
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.textAlign = "center";
        ctx.fillText("Winner!", canvas.width / 2, canvas.height / 2);
        return;
    }
    requestAnimationFrame(draw);
}

let i;
for (i = 0; i < 20; i++) {
    food.push(new Food(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 10 + 5));
}
for (i = 0; i < 20; i++) {
    animals.push(new Animal(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 10 + 5, 'rgb(' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ')'));
}
draw();
