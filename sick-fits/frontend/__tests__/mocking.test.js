function Person(name, foods) {
  this.name = name;
  this.foods = foods;
};

Person.prototype.fetchFavFoods = function() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(this.foods);
    }, 2000);
  });
}

describe('mocking learning', () => {
  it('mocks a reg function', () => {
    const fetchDogs = jest.fn();
    fetchDogs('snickers');
    expect(fetchDogs).toHaveBeenCalled();
    expect(fetchDogs).toHaveBeenCalledWith('snickers');
  });

  it('can create a Person', () => {
    const me = new Person('Miguel', ['pizza']);
    expect(me.name).toBe('Miguel');
  });

  it('can fetch foods', async () => {
    const me = new Person('Miguel', ['pizza']);
    // mock the favFoods function
    me.fetchFavFoods = jest.fn().mockResolvedValue(['pizza']);
    const favFoods = await me.fetchFavFoods();
    expect(favFoods).toContain('pizza');
  });
});