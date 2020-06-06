"use strict";

// ブロックのパターン
const blocks = [
    {
        class: "i",
        pattern: [
            [1, 1, 1, 1]
        ]
    },
    {
        class: "o",
        pattern: [
            [1, 1],
            [1, 1]
        ]
    },
    {
        class: "t",
        pattern: [
            [0, 1, 0],
            [1, 1, 1]
        ]
    },
    {
        class: "s",
        pattern: [
            [0, 1, 1],
            [1, 1, 0]
        ]
    },
    {
        class: "z",
        pattern: [
            [1, 1, 0],
            [0, 1, 1]
        ]
    },
    {
        class: "j",
        pattern: [
            [1, 0, 0],
            [1, 1, 1]
        ]
    },
    {
        class: "l",
        pattern: [
            [0, 0, 1],
            [1, 1, 1]
        ]
    }
];

const tableRow = 20;
const tableColumn = 10;
let cells = [];
let isFalling = false;
let fallingBlockNum = 0;
let score = 0;
const scoreBoard = document.getElementById("score");

// テーブルを配列化する
const loadTable = () => {
    const td_array = document.getElementsByTagName("td");
    let index = 0;
    for (let r = 0; r < tableRow; r++) {
        cells[r] = [];
        for (let c = 0; c < tableColumn; c++) {
            cells[r][c] = td_array[index];
            cells[r][c].blockNum = -1;
            index++;
        }
    }
}

// ブロックを落とす
const fallBlocks = () => {
    // 一番したの行のクラスを開ける
    for (let c = 0; c < tableColumn; c++) {
        // 落としているブロックが一番
        if (cells[tableRow - 1][c].blockNum === fallingBlockNum) {
            isFalling = false;
            return;
        }
    }

    // 下から二番目の行から繰り返しクラスを下げる
    for (let r = tableRow - 2; r >= 0; r--) {
        for (let c = 0; c < tableColumn; c++) {
            // 今落ちている最中のブロックか
            if (cells[r][c].blockNum === fallingBlockNum) {
                // 下にブロックがあるかどうか. あったら動かせないので return
                if (cells[r + 1][c].className !== "" && cells[r + 1][c].blockNum !== fallingBlockNum) {
                    isFalling = false;
                    return;
                }
            }
        }
    }
    // 下から二番目の行から繰り返しクラスを下げる
    for (let r = tableRow - 2; r >= 0; r--) {
        for (var c = 0; c < tableColumn; c++) {
            if (cells[r][c].blockNum === fallingBlockNum) {
                cells[r + 1][c].className = cells[r][c].className;
                cells[r + 1][c].blockNum = cells[r][c].blockNum;
                cells[r][c].className = "";
                cells[r][c].blockNum = -1;
            }
        }
    }
}

// 落下中のブロックがあるか確認する
const hasFallingBlock = () => {
    return isFalling;
}

// そろっている行を消す
const deleteRow = () => {
    for (let r = tableRow - 1; 0 <= r; r--) {
        // 下から消せるか確認
        let canDelete = true;
        for (let c = 0; c < tableColumn; c++) {
            if (cells[r][c].className === "") {
                canDelete = false
                break;
            }
        }

        if (!canDelete) {
            continue;
        }

        score++;
        scoreBoard.textContent = "Your score: " + score;

        // 上のブロックを全て1マスずつ落とす
        for (let i = r - 1; i >= 0; i--) {
            for (let j = 0; j < tableColumn; j++) {
                cells[i + 1][j].className = cells[i][j].className;
                cells[i + 1][j].blockNum = cells[i][j].blockNum;
                cells[i][j].className = "";
                cells[i][j].blockNum = -1;
            }
        }
    }
}

// ランダムにブロックを生成する
const generateBlock = () => {
    const numBlocks = blocks.length;
    const idx = Math.floor(Math.random() * numBlocks);
    const nextBlock = blocks[idx];
    const pattern = nextBlock.pattern;

    // 生成するブロックに番号を振っていく
    fallingBlockNum += 1;

    for (let r = 0; r < pattern.length; r++) {
        for (let c = 0; c < pattern[r].length; c++) {
            if (pattern[r][c]) {
                // 左から四番目に配置
                cells[r][c + 3].className = nextBlock.class;
                cells[r][c + 3].blockNum = fallingBlockNum;
            }
        }
    }

    isFalling = true;

    return;
}

// ブロックを右に移動させる
const moveRight = () => {
    // 動かせるかどうかを確認
    for (let r = 0; r < tableRow; r++) {
        for (let c = 0; c < tableColumn; c++) {
            if (c === tableColumn - 1) {
                if (cells[r][c].blockNum === fallingBlockNum) {
                    // みぎに動かせない
                    return;
                }
            } else {
                if (cells[r][c].blockNum === fallingBlockNum) {
                    if (cells[r][c + 1].blockNum !== -1 && cells[r][c + 1].blockNum !== fallingBlockNum) {
                        // 右に動かせない
                        return;
                    }
                }
            }
        }
    }

    for (let r = 0; r < tableRow; r++) {
        for (let c = tableColumn - 2; 0 <= c; c--) {
            if (cells[r][c].blockNum === fallingBlockNum) {
                cells[r][c + 1].className = cells[r][c].className;
                cells[r][c + 1].blockNum = cells[r][c].blockNum;
                cells[r][c].className = "";
                cells[r][c].blockNum = -1;
            }
        }
    }
}

// ブロックを左に移動させる
const moveLeft = () => {
    // 動かせるかどうかを確認
    for (let r = 0; r < tableRow; r++) {
        for (let c = 0; c < tableColumn; c++) {
            if (c === 0) {
                if (cells[r][c].blockNum === fallingBlockNum) {
                    // 左に動かせない
                    return;
                }
            } else {
                if (cells[r][c].blockNum === fallingBlockNum) {
                    if (cells[r][c - 1].blockNum !== -1 && cells[r][c - 1].blockNum !== fallingBlockNum) {
                        // 右に動かせない
                        return;
                    }
                }
            }
        }
    }

    for (let r = 0; r < tableRow; r++) {
        for (let c = 1; c < tableColumn; c++) {
            if (cells[r][c].blockNum === fallingBlockNum) {
                cells[r][c - 1].className = cells[r][c].className;
                cells[r][c - 1].blockNum = cells[r][c].blockNum;
                cells[r][c].className = "";
                cells[r][c].blockNum = null;
            }
        }
    }
}

// ゲームオーバーかを確認する関数
// 上二行にブロックがあれば停止
const judge = () => {
    for (let r = 0; r < 2; r++) {
        for (let c = 0; c < tableColumn; c++) {
            if (cells[r][c].className !== "") {
                alert("Game Over");
                location.reload();
            }

        }
    }
}

// キーイベントを監視する関数
const onKeyDown = (event) => {
    if (event.key === "Left" || event.key === "ArrowLeft") {
        moveLeft();
    } else if (event.key === "Right" || event.key === "ArrowRight") {
        moveRight();
    } else if (event.key === "Down" || event.key === "ArrowDown") {
        fallBlocks();
    }
}

// キーイベントを追加
document.addEventListener("keydown", onKeyDown);

loadTable();
setInterval(() => {
    if (hasFallingBlock()) {
        fallBlocks();
    } else {
        judge();
        deleteRow();
        generateBlock();
    }
}, 1000);