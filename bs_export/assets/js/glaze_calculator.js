/**
 * Функция для расчета массы порошка и воды по системе уравнений
 * @param {number} volume - Объем глазури в мл
 * @param {number} target_density - Целевая плотность глазури
 * @param {number} powder_density - Истинная плотность сухого порошка
 * @returns {Object} - Объект с массой порошка, массой воды и влажностью
 */
function calculate_powder_and_water(volume, target_density, powder_density) {
  // Вес итоговой глазури
  const total_weight = volume * target_density;
  
  // Решение системы уравнений:
  // mp + mw = total_weight
  // mp/powder_density + mw/1 = volume
  
  // Выражаем mw из первого уравнения: mw = total_weight - mp
  // Подставляем во второе: mp/powder_density + (total_weight - mp)/1 = volume
  // Упрощаем: mp/powder_density + total_weight - mp = volume
  // Преобразуем: mp/powder_density - mp = volume - total_weight
  // Выносим mp за скобки: mp * (1/powder_density - 1) = volume - total_weight
  // Находим mp: mp = (volume - total_weight) / (1/powder_density - 1)
  
  const powder_mass = (volume - total_weight) / (1/powder_density - 1);
  const water_mass = total_weight - powder_mass;
  
  // Расчет влажности как отношение массы воды к массе порошка в процентах
  const moisture = Math.round((water_mass / powder_mass) * 100);
  
  return {
    powder_mass: Math.round(powder_mass * 10) / 10,
    water_mass: Math.round(water_mass * 10) / 10,
    moisture: moisture
  };
} 





//---------------- Triangle ----------------

function generate_triangle_data(size, tester_volume) {
  const data = {};
  // Цвета для трех компонентов
  const a_color = '#FFF200';
  const b_color = '#ED1C24';
  const c_color = '#645FAA';
  
  // Создаем таблицу пропорций в зависимости от размера
  const ratios = generate_triangle_ratios(size);
  
  let point_index = 1;
  
  for (let i = 0; i < ratios.length; i++) {
    const a_ratio = ratios[i][0];  // Процент первого цвета
    const b_ratio = ratios[i][1]; // Процент второго цвета
    const c_ratio = ratios[i][2]; // Процент третьего цвета
    
    // Объем компонентов в зависимости от процентов
    const a_volume = a_ratio > 0 ? Math.round(tester_volume * a_ratio / 100 * 2) / 2 : null;
    const b_volume = b_ratio > 0 ? Math.round(tester_volume * b_ratio / 100 * 2) / 2 : null;
    const c_volume = c_ratio > 0 ? Math.round(tester_volume * c_ratio / 100 * 2) / 2 : null;
    
    // Определяем цвета компонентов
    const first_color = a_ratio > 0 ? a_color : null;
    const second_color = b_ratio > 0 ? b_color : null;
    const third_color = c_ratio > 0 ? c_color : null;

    // Определяем имя точки
    let name;
    //if (a_ratio === 100) name = 'A';
    //else if (b_ratio === 100) name = 'B';
    //else if (c_ratio === 100) name = 'C';
    //else name = `${point_index}`;

    name = `${point_index}`;

    data[point_index] = {
      name: name,
      content: {
        1: [a_ratio > 0 ? a_ratio : null, a_volume, first_color],
        2: [b_ratio > 0 ? b_ratio : null, b_volume, second_color],
        3: [c_ratio > 0 ? c_ratio : null, c_volume, third_color]
      }
    };
    
    point_index++;
  }
  
  return data;
}


function generate_triangle_ratios(size) {
  // Таблица процентов для разных размеров линии
  const ratio_tables = {
    3: [[100, 0, 0], [50, 50, 0], [50, 0, 50], [0, 100, 0], [0, 50, 50], [0, 0, 100]],
    4: [[100, 0, 0], [67, 33, 0], [67, 0, 33], [33, 67, 0], [33, 33, 33], [33, 0, 67], [0, 100, 0], [0, 67, 33], [0, 33, 67], [0, 0, 100]],
  };
  
  // Возвращаем таблицу пропорций для заданного размера
  return ratio_tables[size] || ratio_tables[3]; // Если размер не найден, используем размер 3
}

function generate_triangle_summary(data, size, density, dry_density) {
  let total_a_volume = 0;
  let total_b_volume = 0;
  let total_c_volume = 0;
  
  // Рассчитываем суммы объемов для каждого состава
  for (const point_idx in data) {
    if (data[point_idx].content[1][1]) {
      total_a_volume += data[point_idx].content[1][1];
    }
    if (data[point_idx].content[2][1]) {
      total_b_volume += data[point_idx].content[2][1];
    }
    if (data[point_idx].content[3][1]) {
      total_c_volume += data[point_idx].content[3][1];
    }
  }
  
  // Округляем до 0.5
  total_a_volume = Math.round(total_a_volume * 2) / 2;
  total_b_volume = Math.round(total_b_volume * 2) / 2;
  total_c_volume = Math.round(total_c_volume * 2) / 2;
  
  // Общий объем всех тестеров
  const total_volume = total_a_volume + total_b_volume + total_c_volume;
  
  // Рассчитываем компоненты для каждого состава
  const a_components = calculate_powder_and_water(total_a_volume, density, dry_density);
  const b_components = calculate_powder_and_water(total_b_volume, density, dry_density);
  const c_components = calculate_powder_and_water(total_c_volume, density, dry_density);
  
  // Рассчитываем компоненты для общей базы
  const total_components = calculate_powder_and_water(total_volume, density, dry_density);
  
  // Создаем HTML для блока с суммами
  const summary_html = `
    <div class="card border-0">
      <div class="card-body p-0">
        <h5 class="card-title mb-3">Итого:</h5>
        <div class="mb-3">
          <p class="mb-2"><span class="fw-medium">Составы A, B, C по отдельности:</span> ${total_a_volume}мл (${a_components.powder_mass}г сухой массы + ${a_components.water_mass}г воды) <span class="text-secondary">(влажность ${a_components.moisture}%)</span></p>
          <p class="pt-2 border-top">Если база общая: ${total_volume}мл (${total_components.powder_mass}г сухой массы + ${total_components.water_mass}г воды)</p>
        </div>
      </div>
    </div>
  `;
  
  return summary_html;
}



























//---------------- Linear ----------------

// Data generation functions
function generate_line_data(size, tester_volume) {
  const data = {};
  // Начальный и конечный цвета линии
  const start_color = '#FFF200';
  const end_color = '#ED1C24';
  
  // Создаем таблицу пропорций в зависимости от размера
  const ratios = generate_line_ratios(size);
  
  for (let i = 1; i <= size; i++) {
    const first_ratio = ratios[i-1][0];  // Процент первого цвета
    const second_ratio = ratios[i-1][1]; // Процент второго цвета
    
    // Объем компонентов в зависимости от процентов
    const first_volume = first_ratio > 0 ? Math.round(tester_volume * first_ratio / 100 * 2) / 2 : null;
    const second_volume = second_ratio > 0 ? Math.round(tester_volume * second_ratio / 100 * 2) / 2 : null;
    
    // Цвет зависит от соотношения компонентов
    // Если один из компонентов 0%, используем цвет другого компонента
    // Иначе линейно смешиваем цвета
    const first_color = first_ratio > 0 ? start_color : null;
    const second_color = second_ratio > 0 ? end_color : null;


    data[i] = {
      name: i === 1 ? 'A' : (i === size ? 'B' : `A${i-1}`),
      content: {
        1: [first_ratio > 0 ? first_ratio : null, first_volume, first_color],
        2: [second_ratio > 0 ? second_ratio : null, second_volume, second_color]
      }
    };
  }
  
  
  return data;
}



function generate_line_ratios(size) {
  // Таблица процентов для разных размеров линии
  const ratio_tables = {
    3: [[100, 0], [50, 50], [0, 100]],
    4: [[100, 0], [67, 33], [33, 67], [0, 100]],
    5: [[100, 0], [75, 25], [50, 50], [25, 75], [0, 100]],
    6: [[100, 0], [80, 20], [60, 40], [40, 60], [20, 80], [0, 100]],
    7: [[100, 0], [83, 17], [67, 33], [50, 50], [33, 67], [17, 83], [0, 100]],
    8: [[100, 0], [86, 14], [71, 29], [57, 43], [43, 57], [29, 71], [14, 86], [0, 100]],
    9: [[100, 0], [87.5, 12.5], [75, 25], [62.5, 37.5], [50, 50], [37.5, 62.5], [25, 75], [12.5, 87.5], [0, 100]],
    10: [[100, 0], [89, 11], [78, 22], [67, 33], [56, 44], [44, 56], [33, 67], [22, 78], [11, 89], [0, 100]],
    11: [[100, 0], [90, 10], [80, 20], [70, 30], [60, 40], [50, 50], [40, 60], [30, 70], [20, 80], [10, 90], [0, 100]]
  };
  
  // Возвращаем таблицу пропорций для заданного размера
  return ratio_tables[size] || ratio_tables[3]; // Если размер не найден, используем размер 3
}


function generate_linear_summary(data, size, density, dry_density) {
  let total_first_volume = 0;
  let total_second_volume = 0;
  
  // Рассчитываем суммы объемов для каждого состава
  for (let i = 1; i <= size; i++) {
    if (data[i].content[1][1]) {
      total_first_volume += data[i].content[1][1];
    }
    if (data[i].content[2][1]) {
      total_second_volume += data[i].content[2][1];
    }
  }
  
  // Округляем до 0.5
  total_first_volume = Math.round(total_first_volume * 2) / 2;
  total_second_volume = Math.round(total_second_volume * 2) / 2;
  
  // Общий объем всех тестеров
  const total_volume = total_first_volume + total_second_volume;
  
  
  // Рассчитываем компоненты для первого состава
  const first_components = calculate_powder_and_water(total_first_volume, density, dry_density);
  
  // Рассчитываем компоненты для второго состава
  const second_components = calculate_powder_and_water(total_second_volume, density, dry_density);
  
  // Рассчитываем компоненты для общей базы
  const total_components = calculate_powder_and_water(total_volume, density, dry_density);
  
  // Создаем HTML для блока с суммами
  const summary_html = `
    <div class="card border-0">
      <div class="card-body p-0">
        <h5 class="card-title mb-3">Итого:</h5>
        <div class="mb-3">
          <p class="mb-2"><span class="fw-medium">Составы A, B по отдельности:</span> ${total_first_volume}мл (${first_components.powder_mass}г сухой массы + ${first_components.water_mass}г воды) <span class="text-secondary">(влажность ${first_components.moisture}%)</span></p>
          <p class="pt-2 border-top">Если база общая: ${total_volume}мл (${total_components.powder_mass}г сухой массы + ${total_components.water_mass}г воды)</p>
          </div>
      </div>
    </div>
  `;
  
  return summary_html;
}