const Event = require('./data.schema');  

async function saveEventToDatabase(topic, creator, chatId) {
  try {
    const activeEvent = await Event.findOne({ creator, isActive: true });
    if (activeEvent) {
      const errorMsg = `У вас ${creator} вже є активна вечірка: ${activeEvent.topic}`;
      return { success: false, message: errorMsg };
    }
    const newEvent = new Event({
      topic,
      creator,
      isActive: true,  
    });
    await newEvent.save();
    console.log('Новий event збережений!');
    return { success: true, message: 'Епопея збережена!' };
  } catch (err) {
    console.error('Помилка збереження event:', err);
  }
}

async function setEventState(creator) {
    console.log(creator)
  try {
    const activeEvent = await Event.findOne({ creator, isActive: true });
    if (!activeEvent) {
      return { success: false, message: 'Активної вечірки не знайдено.' };
    }
    activeEvent.isActive = false;
    await activeEvent.save();
    return { success: true, message: 'Вечірка зроблена неактивною!' };
  } catch (err) {
    console.error('Помилка деактивації вечірки:', err);
    return { success: false, message: 'Сталася помилка при деактивації вечірки.' };
  }
}

module.exports = { saveEventToDatabase, setEventState };
