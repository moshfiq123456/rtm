import { Request, Response } from 'express';
import Group from '../model/group.model';
import User from '../model/user.model';
import { decodeToken } from '../helpers/decodeToken';

const CreateGroup = async (req: Request, res: Response): Promise<Response> => {
    const decodedToken: any = decodeToken(req.header("Authorization"));
    try {
      const { groupName, members } = req.body;
  
      // Create a new group with the admin being the logged-in user
      const newGroup = new Group({
        groupName,
        admin: decodedToken._id,
        members: [...members, decodedToken._id] // Add the logged-in user as a member
      });
  
      await newGroup.save();
  
      return res.status(201).json({ message: "Group created successfully", group: newGroup });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  };


const GetUserGroups = async (req: Request, res: Response): Promise<Response> => {
    const decodedToken: any = decodeToken(req.header("Authorization"));
    try {
      const userId = decodedToken._id;
  
      // Find groups where the user is either the admin or a member
      const groups = await Group.find({
        $or: [
          { admin: userId },
          { members: userId }
        ]
      }).populate('admin', 'userName') // Optionally populate admin field
        .populate('members', 'userName'); // Optionally populate members field
  
      return res.status(200).json({ groups });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  };
  
  export{CreateGroup,GetUserGroups}