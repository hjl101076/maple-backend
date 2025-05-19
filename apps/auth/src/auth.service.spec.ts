import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  const mockUser = {
    _id: 'user123',
    email: 'user@example.com',
    passwordHash: 'hashedpw',
    role: 'USER',
    toObject: function () {
      const { passwordHash, ...rest } = this;
      return rest;
    },
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn().mockResolvedValue(mockUser),
      createUser: jest.fn().mockImplementation((email, passwordHash, role) => {
        return { email, passwordHash, role };
      }),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mocked.jwt.token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create a new user with hashed password and role', async () => {
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('hashed123'));

      const result = await authService.register(
        'new@example.com',
        'plainpw',
        'USER2',
      );

      expect(result.email).toBe('new@example.com');
      expect(result.passwordHash).toBe('hashed123');
      expect(result.role).toBe('USER2');
    });

    it('should throw if user creation fails', async () => {
      (usersService.createUser as jest.Mock).mockImplementationOnce(() => {
        throw new Error('DB error');
      });

      await expect(
        authService.register('fail@example.com', 'pw', 'USER'),
      ).rejects.toThrow('DB error');
    });
  });

  describe('validateUser', () => {
    it('should validate and return user if credentials are correct and role matches', async () => {
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      const user = await authService.validateUser(
        'user@example.com',
        'password',
        'USER',
      );
      expect(user.email).toBe('user@example.com');
      expect(user.role).toBe('USER');
    });

    it('should throw if password is incorrect', async () => {
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));
      await expect(
        authService.validateUser('user@example.com', 'wrongpw', 'USER'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if role does not match', async () => {
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      await expect(
        authService.validateUser('user@example.com', 'password', 'ADMIN'),
      ).rejects.toThrow('요청한 역할과 일치하지 않습니다.');
    });
  });

  describe('login', () => {
    it('should return JWT token payload', async () => {
      const token = await authService.login(mockUser);
      expect(token).toEqual({ access_token: 'mocked.jwt.token' });
    });
  });
});
