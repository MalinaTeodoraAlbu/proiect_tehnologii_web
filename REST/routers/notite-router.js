import { Note } from "../Models/model.js";
import { Folder } from "../Models/model.js";
import { User } from "../Models/model.js";
import { UserFolder } from "../Models/model.js";
import express from "express";


const router = express.Router()

// get all users 
router.get('/users', async (req, res, next) => {
    try {
      const query = {}
     
      const users = await User.findAll(query)
      res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  })
  
  //get all folders
  router.get('/folders', async (req, res, next) => {
    try {
      const query = {}
    
      const folders = await Folder.findAll(query)
      res.status(200).json(folders)
    } catch (err) {
      next(err)
    }
  })


  //get all notes
  router.get('/notes', async (req, res, next) => {
    try {
      const query = {}
   
      const notes = await Note.findAll(query)
      res.status(200).json(notes)
    } catch (err) {
      next(err)
    }
  })

  
  
  router.get('/users/:eid', async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.eid)
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } catch (err) {
      next(err)
    }
  })

  router.get('/folders/:eid', async (req, res, next) => {
    try {
      const folder = await Folder.findByPk(req.params.eid)
      if (folder) {
        res.status(200).json(folder)
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } catch (err) {
      next(err)
    }
  })
  
  router.get('/notes/:eid', async (req, res, next) => {
    try {
      const note = await Note.findByPk(req.params.eid)
      if (note) {
        res.status(200).json(note)
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } catch (err) {
      next(err)
    }
  })


  // insert
  router.post('/addusers', async (req, res, next) => {
    try {
      const newUser = await User.create(req.body, ['name','surname','email','password'])
      res.status(200).json(newUser);
    } catch (err) {
      next(err)
    }
  })

  router.post('/addnotes', async (req, res, next) => {
    try {
      const newNote = await Note.create({
        title: req.body.title,
        context: req.body.context,
        tag: req.body.tag,
        userId: req.body.userId,
        folderId: req.body.folderId
      });
      res.status(200).json(newNote);
    } catch (err) {
      next(err)
    }
  });

  router.post('/addfolders', async (req, res, next) => {
    try {
      const newFolder = await Folder.create(req.body)
      res.status(200).json(newFolder);
    } catch (err) {
      next(err)
    }
  })



    //update 
    router.put('/updateuser/:userId', async(req,res, next) => {
      try{
        const user = await User.findByPk(req.params.userId);
        if(user){
          await user.update(req.body,{fields: ['name','surname','email','password']});
         
          return res.status(200).json({message: 'accepted'});
        }else{
          return res.status(404).json({error: `User with id ${req.params.userId} not found`});
        }
  
      }catch(err){
        next(err)
      }
    })
  
    router.put('/updatefolders/:folderId', async(req,res, next) => {
      try{
        const folder = await Folder.findByPk(req.params.folderId);
        if(folder){
          await folder.update(req.body,{fields: ['title']});
         
          return res.status(200).json({message: 'accepted'});
        }else{
          return res.status(404).json({error: `Folder with id ${req.params.folderId} not found`});
        }
  
      }catch(err){
        next(err)
      }
    })


    router.put('/updatenotes/:noteId', async(req,res, next) => {
      try{
        const note = await Note.findByPk(req.params.noteId);
        if(note){
          await note.update(req.body,{fields: ['title','context','date']});
         
          return res.status(200).json({message: 'accepted'});
        }else{
          return res.status(404).json({error: `Note with id ${req.params.noteId} not found`});
        }
  
      }catch(err){
        next(err)
      }
    })
  
  
    //delete
    router.delete('/users/:userId', async(req, res, next) =>{
      try {
        const user = await User.findByPk(req.params.userId); 
        if (user) {
          await user.destroy();
          return res.status(200).json("User deleted successfully!");
        } else {
          return res
            .status(404)
            .json({ error: `User with id ${req.params.userId} not found` });
        }
      } catch (err) {
       next(err);
      }
    })

    router.delete('/folders/:folderId', async(req, res, next) =>{
      try {
        const folder = await Folder.findByPk(req.params.folderId); 
        if (folder) {
          await folder.destroy();
          return res.status(200).json("Folder deleted successfully!");
        } else {
          return res
            .status(404)
            .json({ error: `Folder with id ${req.params.folderId} not found` });
        }
      } catch (err) {
       next(err);
      }
    })

    router.delete('/notes/:noteId', async(req, res, next) =>{
      try {
        const note = await Note.findByPk(req.params.noteId); 
        if (note) {
          await note.destroy();
          return res.status(200).json("User deleted successfully!");
        } else {
          return res
            .status(404)
            .json({ error: `Note with id ${req.params.noteId} not found` });
        }
      } catch (err) {
       next(err);
      }
    })
  

// get foldere user
    router.get(
      "/:userId/UserFolder",
      async (req, response, next) => {
        try {
          const user = await User.findByPk(req.params.userId);
      if (user) {
        const folders = await user.getFolders();
        if (folders.length > 0) {
          response.json(folders);
        }
            else {
              response.sendStatus(204);
            }
          } else {w
            response.sendStatus(404);
          }
          
        } catch (error) {
          next(error);
        }
      }
    );


// post join
    router.post(
      "/:userId/UserFolder/:folderId",
      async (req, res, next) => {
        try {
          const user = await User.findByPk(req.params.userId);
          const folder = await Folder.findByPk(req.params.folderId);
          if (user && folder) {
            const newUserFolder = await UserFolder.create({
              userId: req.params.userId,
              folderId: req.params.folderId,
              tip_stare: req.body.tip_stare
            });
            user.addFolder(folder);
            user.save();
            res.status(200).json(newUserFolder);
          } else {
            res.sendStatus(404);
          }
        } catch (error) {
          next(error);
        }
      }
    );

//get user unui folder
router.get(
  "/folders/:folderId/UserFolder",
  async (req, response, next) => {
    try {
      const folder = await Folder.findByPk(req.params.folderId);
          if(folder){
            const users = await folder.getUsers({ attributes: ["id","name"] });
            if (users.length > 0) {
              response.json(users);
            }
            else {
              response.sendStatus(204);
            }
          } else {
            response.sendStatus(404);
          }
    } catch (error) {
      next(error);
    }
  }
);




router.post(
  "/folders/:folderId/UserFolder/:userId",
  async (req, response, next) => {
    try {
      const user = await User.findByPk(req.params.userId);
      const folder = await Folder.findByPk(req.params.folderId);
      if (folder && user) {
        const newUserFolder = await UserFolder.create({
          userId: req.params.userId,
          folderId: req.params.folderId,
          tip_stare: req.body.tip_stare
        });
        folder.addUser(user);
        folder.save();
        response.status(200).json(newUserFolder);
        response.sendStatus(204);
      } else {
        response.sendStatus(400);
      }
    } catch (error) {
      next(error);
    }
  }
);

//sterge folderul unui user
router.delete(
  "/:userId/UserFolder/:folderId",
  async (req, response, next) => {
    try {
      const user = await User.findByPk(req.params.userId);
      const folder = await Folder.findByPk(req.params.folderId);
      if (user && folder) {
        user.removeFolder(folder);
        user.save();
        response.sendStatus(204);
      } else {
        response.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  }
);

//get folder notes
router.get(
  "/:folderId/notes",
  async (req, response, next) => {
    try {
      const folder = await Folder.findByPk(req.params.folderId);
  if (folder) {
    const notes = await folder.getNotes();
    if (notes.length > 0) {
      response.json(notes);
    }
        else {
          response.sendStatus(204);
        }
      } else {w
        response.sendStatus(404);
      }
      
    } catch (error) {
      next(error);
    }
  }
);

  export { router as notiteRouter };