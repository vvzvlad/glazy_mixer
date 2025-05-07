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