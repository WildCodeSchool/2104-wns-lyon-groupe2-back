const updateFolder = require('../controllers/FolderController').updateFolder

describe('test', () => {
  it('should be able to return true', () => {
    expect(updateFolder).toBeDefined()
  })
})
