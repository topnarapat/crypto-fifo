async function readOrder() {
  const orderFromFile = [];
  await fetch("./crypto_tax.txt")
    .then((response) => response.text())
    .then((data) => {
      const lines = data.split(/\r\n|\n/);
      for (const line of lines) {
        const order = line.split(" ");
        order[2] = parseFloat(order[2]);
        order[3] = parseFloat(order[3]);
        orderFromFile.push(order);
      }
    });

  actionOrder(orderFromFile);
}

readOrder();

function actionOrder(orderFromFile) {
  let wallet = {};
  let profit = 0;

  for (let i = 0; i < orderFromFile.length; i++) {
    if (orderFromFile[i][0] === "S" && !(orderFromFile[i][1] in wallet)) {
      alert(`don't have ${orderFromFile[i][1]} for sell`);
      return;
    }

    if (orderFromFile[i][0] === "B") {
      if (orderFromFile[i][1] in wallet) {
        wallet[orderFromFile[i][1]] += parseFloat(orderFromFile[i][3]);
      } else {
        wallet[orderFromFile[i][1]] = parseFloat(orderFromFile[i][3]);
      }
    }

    if (
      orderFromFile[i][0] === "S" &&
      orderFromFile[i][3] > 0 &&
      orderFromFile[i][3] <= wallet[orderFromFile[i][1]]
    ) {
      for (let j = 0; j < orderFromFile.length; j++) {
        if (
          orderFromFile[j][0] === "B" &&
          orderFromFile[i][1] === orderFromFile[j][1] &&
          orderFromFile[j][3] > 0
        ) {
          wallet[orderFromFile[i][1]] -= orderFromFile[i][3];
          if (orderFromFile[i][3] > orderFromFile[j][3]) {
            orderFromFile[i][3] = orderFromFile[i][3] - orderFromFile[j][3];
            profit +=
              (orderFromFile[i][2] - orderFromFile[j][2]) * orderFromFile[j][3];
            orderFromFile[j][3] = 0;
          } else {
            orderFromFile[j][3] = orderFromFile[j][3] - orderFromFile[i][3];
            profit +=
              (orderFromFile[i][2] - orderFromFile[j][2]) * orderFromFile[i][3];
            orderFromFile[i][3] = 0;
          }
        }
      }
    }
  }

  console.log("Profit :", profit);
  const html = `Profit : ${profit}`;
  const container = document.getElementById("container");
  container.append(html);
}
