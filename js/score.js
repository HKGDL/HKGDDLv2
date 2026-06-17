const scale = 3;

export function score(rank, percent, minPercent, totalLevels) {
  if (!totalLevels || totalLevels <= 1) totalLevels = 587;

  if (rank > 75 && percent < 100) {
    return 0;
  }

  let raw = Math.max(0, 500 * (1 - Math.log10(rank) / Math.log10(totalLevels))) *
    ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));

  if (percent != 100) {
    return Math.max(0, round(raw - raw / 3));
  }

  return Math.max(1, round(raw));
}

export function round(num) {
  if (!('' + num).includes('e')) {
    return +(Math.round(num + 'e+' + scale) + 'e-' + scale);
  } else {
    var arr = ('' + num).split('e');
    var sig = '';
    if (+arr[1] + scale > 0) {
      sig = '+';
    }
    return +(
      Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) +
      'e-' +
      scale
    );
  }
}
