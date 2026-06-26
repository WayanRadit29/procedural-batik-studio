function drawParang(ctx, config = {}) {

    const {
        size = 40,
        spacing = 0,
        primaryColor,
        secondaryColor,
        colors: _colors
    } = config;

    const colors = {
        primary: primaryColor || (_colors && _colors.primary) || "#663399",
        secondary: secondaryColor || (_colors && _colors.secondary) || "#F28C28"
    };

    const cell = size;

    // ==========================================
    // PATTERN
    // ==========================================

    const pattern = [

        "ABFGEABFGEABFGEABFGE",
        "DEGFCDEGFCDEGFCDEGFC",
        "GEABFGEABFGEABFGEABF",
        "FCDEGFCDEGFCDEGFCDEG",
        "BFGEABFGEABFGEABFGEA",
        "EGFCDEGFCDEGFCDEGFCD",
        "EABFGEABFGEABFGEABFG",
        "CDEGFCDEGFCDEGFCDEGF",
        "FGEABFGEABFGEABFGEAB",
        "GFCDEGFCDEGFCDEGFCDE"

    ];

    // ==========================================
    // PRIMITIVE
    // ==========================================
    // Square
    function drawPurpleSquare(x, y){

        ctx.fillStyle = colors.primary;
    
        ctx.fillRect(
            x,
            y,
            cell,
            cell
        );
    
    }
    // Draw secondary square    
    function drawOrangeSquare(x, y){

        ctx.fillStyle = colors.secondary;
    
        ctx.fillRect(
            x,
            y,
            cell,
            cell
        );
    
    }
    // Circle
    function drawCircle(x, y){
        console.log(colors.circle);
        ctx.beginPath();
    
        ctx.arc(
            x + cell/2,
            y + cell/2,
            cell/2,
            0,
            Math.PI * 2
        );
    
        ctx.fillStyle = "yellow";
    
        ctx.fill();
    
    }
    // Draw Leaf
    function drawLeaf(x, y, angle = -45){

        ctx.save();
    
        ctx.translate(
            x + cell / 2,
            y + cell / 2
        );
    
        ctx.rotate(
            angle * Math.PI / 180
        );
    
        ctx.fillStyle = colors.secondary;
    
        const r = cell * 0.65;
    
        ctx.beginPath();
    
        ctx.moveTo(
            0,
            -r
        );
    
        ctx.quadraticCurveTo(
            r,
            0,
            0,
            r
        );
    
        ctx.quadraticCurveTo(
            -r,
            0,
            0,
            -r
        );
    
        ctx.fill();
    
        ctx.restore();
    
    }
    // Draw Diamond
    function drawDiamond(x, y){

        ctx.fillStyle = colors.secondary;
    
        ctx.beginPath();
    
        ctx.moveTo(
            x + cell/2,
            y
        );
    
        ctx.lineTo(
            x + cell,
            y + cell/2
        );
    
        ctx.lineTo(
            x + cell/2,
            y + cell
        );
    
        ctx.lineTo(
            x,
            y + cell/2
        );
    
        ctx.closePath();
    
        ctx.fill();
    
    }
    // Draw Biji Kopi
    function drawBean(x, y){

        ctx.save();
    
        ctx.translate(
            x + cell/2,
            y + cell/2
        );
    
        ctx.rotate(
            -45 * Math.PI / 180
        );
    
        ctx.beginPath();
    
        ctx.ellipse(
            0,
            0,
            cell * 0.35,
            cell * 0.2,
            0,
            0,
            Math.PI * 2
        );
    
        ctx.fillStyle = "gold";
    
        ctx.fill();
    
        ctx.restore();
    
    }
    
    // Draw Bunga 4 Kelopak
    function drawFlower4(x, y, angle = 0){

        ctx.save();
    
        // pindah ke tengah sel
        ctx.translate(
            x + cell/2,
            y + cell/2
        );
    
        // rotasi
        ctx.rotate(
            angle * Math.PI / 180
        );
    
        ctx.fillStyle = colors.secondary;
    
        const rx = cell * 0.18;
        const ry = cell * 0.28;
    
        // atas
        ctx.beginPath();
        ctx.ellipse(
            0,
            -cell * 0.2,
            rx,
            ry,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();
    
        // kanan
        ctx.beginPath();
        ctx.ellipse(
            cell * 0.2,
            0,
            ry,
            rx,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();
    
        // bawah
        ctx.beginPath();
        ctx.ellipse(
            0,
            cell * 0.2,
            rx,
            ry,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();
    
        // kiri
        ctx.beginPath();
        ctx.ellipse(
            -cell * 0.2,
            0,
            ry,
            rx,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();
    
        // putik
        ctx.fillStyle = colors.primary;
    
        ctx.beginPath();
        ctx.arc(
            0,
            0,
            cell * 0.08,
            0,
            Math.PI * 2
        );
        ctx.fill();
    
        ctx.restore();
    
    }

    // ==========================================
    // QUARTER
    // ==========================================

    function drawQuarterTL(x, y){

        ctx.fillStyle = colors.primary;
    
        ctx.beginPath();
    
        ctx.moveTo(
            x + cell,
            y + cell
        );
    
        ctx.arc(
            x + cell,
            y + cell,
            cell,
            Math.PI,
            Math.PI * 1.5
        );
    
        ctx.closePath();
    
        ctx.fill();
    
    }

    function drawQuarterTR(x, y){

        ctx.fillStyle = colors.primary;
    
        ctx.beginPath();
    
        ctx.moveTo(
            x,
            y + cell
        );
    
        ctx.arc(
            x,
            y + cell,
            cell,
            Math.PI * 1.5,
            Math.PI * 2
        );
    
        ctx.closePath();
    
        ctx.fill();
    
    }

    function drawQuarterBL(x, y){

        ctx.fillStyle = colors.primary;
    
        ctx.beginPath();
    
        ctx.moveTo(
            x + cell,
            y
        );
    
        ctx.arc(
            x + cell,
            y,
            cell,
            Math.PI / 2,
            Math.PI
        );
    
        ctx.closePath();
    
        ctx.fill();
    
    }

    function drawQuarterBR(x, y){

        ctx.fillStyle = colors.primary;
    
        ctx.beginPath();
    
        ctx.moveTo(
            x,
            y
        );
    
        ctx.arc(
            x,
            y,
            cell,
            0,
            Math.PI / 2
        );
    
        ctx.closePath();
    
        ctx.fill();
    
    }

    // ==========================================
    // DRAW SYMBOL
    // ==========================================

    function drawSymbol(symbol, x, y){

        switch(symbol){

            case 'A':
                drawQuarterTL(x, y);
                break;

            case 'B':
                drawQuarterTR(x, y);
                break;

            case 'C':
                drawQuarterBL(x, y);
                break;

            case 'D':
                drawQuarterBR(x, y);
                break;

            case 'E':
                drawPurpleSquare(x, y);
                break;

            case 'F':
                drawLeaf(x, y,-45);
                break;

            case 'G':
                drawLeaf(x, y,45);
                break;

        }

    }
    
        // ==========================================
    // DRAW PATTERN
    // ==========================================

    const rows = Math.ceil(
        ctx.canvas.height / (cell + spacing)
    );

    const cols = Math.ceil(
        ctx.canvas.width / (cell + spacing)
    );

    for(let row = 0; row < rows; row++){

        for(let col = 0; col < cols; col++){

            const symbol =
                pattern[row % pattern.length][col % pattern[0].length];

            const x = col * (cell + spacing);
            const y = row * (cell + spacing);

            drawSymbol(
                symbol,
                x,
                y
            );

        }

    }

    

}
