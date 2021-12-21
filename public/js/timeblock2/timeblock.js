import data from '../store/scheduler.js';

const COLORS = [
  '#F15F5F',
  '#F29661',
  '#F2CB61',
  '#E5D85C',
  '#BCE55C',
  '#86E57F',
  '#5CD1E5',
  '#6799FF',
  '#6B66FF',
  '#A566FF',
  '#F361DC',
  '#F361A6',
  '#A6A6A6',
  '#8C8C8C',
];

const render = () => {
  const $dates = document.querySelectorAll('.date-grid > div');
  $dates.forEach($date => {
    [...$date.children].forEach(timeBlock => {
      timeBlock.remove();
    });
  });

  data.store.schedules.forEach(schedule => {
    let start;
    let end;
    const counting = [];
    const { id } = schedule;

    $dates.forEach(($date, idx) => {
      if (schedule.startDay === $date.dataset.date) start = idx + 1;
      if (schedule.endDay === $date.dataset.date) end = idx + 1;
    });

    const timeBlockRange = [...$dates].slice(start - 1, end);

    timeBlockRange.forEach(timeBlock => {
      let flag = true;
      let cnt = 0;
      [...timeBlock.children].reverse().forEach(block => {
        if (flag && block.style.opacity === '0') {
          cnt += 1;
        } else {
          flag = false;
        }
      });
      counting.push(cnt);
    });

    const min = Math.min(...counting, Infinity);

    timeBlockRange.forEach(timeBlock => {
      for (let i = 0; i < min; i++) {
        timeBlock.removeChild(timeBlock.lastChild);
      }
    });

    let flag = false;
    $dates.forEach($date => {
      const div = document.createElement('div');

      if (schedule.startDay === $date.dataset.date) flag = true;
      if (flag) {
        div.className = `timeblock${id}`;
        div.classList.add('tooltip');
        div.style.opacity = 1;
        div.style.height = '25px';
        div.style.background = COLORS[id % COLORS.length];
      } else {
        div.style.opacity = 0;
        div.style.height = '25px';
      }

      if (schedule.endDay === $date.dataset.date) flag = false;

      $date.appendChild(div);
    });

    timeBlockRange.forEach(timeBlock => {
      for (let i = 0; i < min; i++) {
        const div = document.createElement('div');
        div.style.opacity = 0;
        div.style.height = '25px';

        timeBlock.appendChild(div);
      }
    });
  });

  const counting = [];
  $dates.forEach($date => {
    let flag = true;
    let removeCtn = 0;
    [...$date.children].reverse().forEach(timeBlock => {
      if (flag && timeBlock.style.opacity === '0') {
        removeCtn++;
      } else flag = false;
    });
    counting.push(removeCtn);
  });

  const min = Math.min(...counting, Infinity);

  $dates.forEach($date => {
    for (let i = 0; i < min; i++) {
      $date.removeChild($date.lastChild);
    }
  });
};

(async () => {
  await data.fetchSchedules();
  render();
})();
