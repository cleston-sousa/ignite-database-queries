import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {

    const user = await this.repository.findOne(
      {
        where: { id: user_id },
        relations: ['games'],
      }
    );

    if (!user) throw new Error("User doesn't exists.")

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const users = await this.repository.query(`select * from users order by first_name asc`);
    return users;
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const users = await this.repository.query(`select * from users where lower(first_name) = lower('${first_name}') and lower(last_name) = lower('${last_name}') order by first_name asc`);
    return users;
  }
}
