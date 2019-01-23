import bcrypt from 'bcrypt';

import sendResponse, {
  sendServerErrorResponse,
  FAIL,
  ERROR,
  SUCCESS,
} from '../helpers/sendResponse';
import UserRepository from '../repositories/UserRepository';
import { generateToken } from '../helpers/jwtHelper';

class AuthController {
  constructor() {
    this.repo = new UserRepository();
  }

  /**
   * @description Signs up a new User to the platform
   *
   * @param {object} req - The request object received
   * @param {object} res - The response object sent
   *
   * @returns {object}
   */
  signup = async (req, res) => {
    const { firstname, lastname, email, password } = req.body.user;
    try {
      const user = await this.repo.exists({ email });

      if (!user) {
        const passwordHash = bcrypt.hashSync(password, 10);
        const newUser = await this.repo.save({
          firstname,
          lastname,
          email,
          password: passwordHash,
        });
        return sendResponse(
          res,
          'success',
          201,
          {
            ...newUser,
            password: undefined,
            token: generateToken(
              { id: newUser.id, email, admin: false },
              '72h',
            ),
          },
          'User sign up successful',
        );
      }

      return sendResponse(res, FAIL, 409, undefined, 'User with email exists');
    } catch (err) {
      return sendServerErrorResponse(res, err);
    }
  };

  /**
   * @description Authenticate User and returns a token
   *
   * @param {object} req - The request object received
   * @param {object} res - The response object sent
   *
   * @returns {object}
   */
  login = async (req, res) => {
    const { email, password } = req.body.user;
    try {
      const user = await this.repo.getOne({ email });

      if (user) {
        const hashValue = bcrypt.compareSync(password, user.password);
        if (hashValue) {
          return sendResponse(
            res,
            'success',
            200,
            {
              ...user,
              password: undefined,
              token: generateToken({ id: user.id, email, admin: false }, '72h'),
            },
            'User login successful',
          );
        }

        return sendResponse(
          res,
          ERROR,
          401,
          undefined,
          'User login failed, wrong login credentials',
        );
      }

      return sendResponse(
        res,
        ERROR,
        401,
        undefined,
        'User login failed, wrong login credentials',
      );
    } catch (err) {
      return sendServerErrorResponse(res, err);
    }
  };

  /**
   * @description Returns the account/profile details of the authenticated user
   *
   * @param {object} req - The request object received
   * @param {object} res - The response object sent
   *
   * @returns {object}
   */
  getProfile = async (req, res) => {
    const { id } = req.body.token;
    try {
      const user = await this.repo.getOne({ id });
      return sendResponse(
        res,
        SUCCESS,
        200,
        { ...user },
        'User details retrieved successfully',
      );
    } catch (err) {
      return sendServerErrorResponse(res, err);
    }
  };

  /**
   * @description Updates the password of the authenticated user
   *
   * @param {Object} req - The request object received
   * @param {Object} res - The response object sent
   *
   * @returns {Object}
   */
  updatePassword = async (req, res) => {
    const { id } = req.body.token;
    try {
      const { oldpassword, newpassword } = req.body.modifiedPasswords;
      const user = await this.repo.getOne({ id });
      const hashValue = bcrypt.compareSync(oldpassword, user.password);

      if (hashValue) {
        await this.repo.update({ password: newpassword }, { id });
        return sendResponse(
          res,
          SUCCESS,
          200,
          undefined,
          'User password updated successfully',
        );
      }

      return sendResponse(res, ERROR, 400, undefined, 'Password is incorrect');
    } catch (err) {
      return sendServerErrorResponse(res, err);
    }
  };

  /**
   * @description Updates the profile of the authenticated user
   *
   * @param {Object} req - The request object received
   * @param {Object} res - The response object sent
   *
   * @returns {Object}
   */
  updateProfile = async (req, res) => {
    const { id } = req.body.token;
    const { firstname, lastname } = req.body.profile;
    try {
      const user = await this.repo.update({ firstname, lastname }, { id });
      return sendResponse(
        res,
        SUCCESS,
        200,
        { ...user },
        'User profile updated successfully',
      );
    } catch (err) {
      return sendServerErrorResponse(res, err);
    }
  };
}

export default new AuthController();
