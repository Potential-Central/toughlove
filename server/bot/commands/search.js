/* eslint-disable no-return-await */
// This is broken as of this push, only here for the loader not to error out.
module.exports.execute = async (client, message, args) => {
  const searchTerm = args.join(' ');
  const query = args.join('+');

  if (searchTerm.length === 0) {
    return await message.channel.send(
      'Example.'
    );
  }
  return await message.channel.send(
    `Example: ${searchTerm}: https://www.google.com/search?q=${query}`,
  );
};

module.exports.config = {
  name: 'search',
  aliases: ['search', 'искать', 'гугл'],
  description: 'Поиск в гугл по запросу.',
  usage: ['search', 'искать', 'гугл'],
};
