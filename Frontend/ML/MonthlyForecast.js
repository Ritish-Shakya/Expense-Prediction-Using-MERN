import * as tf from "@tensorflow/tfjs";

export const forecastNextMonth = async (transactions) => {
  if (!transactions || transactions.length < 2) return 0;

  const monthlyTotals = {};

  transactions.forEach((item) => {
    const date = new Date(item.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!monthlyTotals[key]) monthlyTotals[key] = 0;
    monthlyTotals[key] += Number(item.amount);
  });

  //  Sort months
  const sortedKeys = Object.keys(monthlyTotals).sort();
  const totals = sortedKeys.map((key) => monthlyTotals[key]);

  if (totals.length < 2) return 0;

  const xs = tf.tensor2d(
    totals.map((_, i) => [i]),
    [totals.length, 1]
  );

  const ys = tf.tensor2d(totals, [totals.length, 1]);

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

  model.compile({
    optimizer: tf.train.sgd(0.001),
    loss: "meanSquaredError",
  });

  await model.fit(xs, ys, { epochs: 150 });

  const nextIndex = totals.length;

  const value = tf.tidy(() => {
    const prediction = model.predict(tf.tensor2d([[nextIndex]]));
    return prediction.dataSync()[0];
  });

  tf.dispose([xs, ys]);

  return value > 0 ? Math.round(value) : 0;
};