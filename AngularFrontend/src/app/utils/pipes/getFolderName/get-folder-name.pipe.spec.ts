import { GetFolderNamePipe } from './get-folder-name.pipe';

describe('GetFolderNamePipe', () => {
  it('create an instance', () => {
    const pipe = new GetFolderNamePipe();
    expect(pipe).toBeTruthy();
  });
});
