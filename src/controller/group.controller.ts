import { Request, Response } from 'express';
import Group from '../model/group.model';
import User from '../model/user.model';
import { decodeToken } from '../helpers/decodeToken';

const CreateGroup = async (req: Request, res: Response) => {
    const decodedToken: any = decodeToken(req.header("Authorization"));
    const { groupName, members } = req.body; // members should be an array of user IDs
  
    try {
      // Validate the request body
      if (!groupName || !members || !Array.isArray(members)) {
        return res.status(400).json({ error: true, message: 'Invalid request data' });
      }
  
      // Ensure the current user is authenticated
      const adminId = decodedToken?._id; // Assuming req.user contains the authenticated user's ID
  
      // Check if all members are valid users
      const users = await User.find({ '_id': { $in: members } });
      if (users.length !== members.length) {
        return res.status(400).json({ error: true, message: 'One or more members are invalid' });
      }
  
      // Create the group
      const newGroup = new Group({
        groupName,
        admin: adminId,
        members: [...members, adminId], // Add the admin to the members list
      });
  
      await newGroup.save();
  
      res.status(201).json({
        error: false,
        message: 'Group created successfully',
        group: newGroup,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
  };
  export{CreateGroup}