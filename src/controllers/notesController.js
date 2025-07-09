const Note = require('../models/Note');

//  Get all notes for a specific job and jobseeker
exports.getNotesByJob = async (req, res) => {
    const { jobseekerId, jobId } = req.params;

    try {
        const notes = await Note.findAll({
            where: {
                jobseeker_id: jobseekerId,
                imported_job_id: jobId
            },
            order: [['created_at', 'DESC']]
        });
        res.json({
            success: true,
            message: "Note Created",
            data: notes
        }
        );
    } catch (err) {
        console.error("Error fetching notes:", err);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
};

//  Create a new note
exports.createNote = async (req, res) => {
    const { text, jobseeker_id, imported_job_id } = req.body;

    try {
        const note = await Note.create({
            text,
            jobseeker_id,
            imported_job_id
        });
        res.status(201).json({
            success: true,
            message: "Note Created",
            data: note
        });
    } catch (err) {
        console.error("Error creating note:", err);
        res.status(500).json({ error: 'Failed to create note' });
    }
};

//  Update a note
exports.updateNote = async (req, res) => {
    const noteId = req.params.id;
    const { text } = req.body;

    try {
        const note = await Note.findByPk(noteId);
        if (!note) return res.status(404).json({ error: 'Note not found' });

        note.text = text;
        await note.save();
        res.json({success:true, data:note});
    } catch (err) {
        console.error("Error updating note:", err);
        res.status(500).json({ error: 'Failed to update note' });
    }
};

//  Delete a note
exports.deleteNote = async (req, res) => {
    const noteId = req.params.id;

    try {
        const deleted = await Note.destroy({ where: { id: noteId } });
        console.log(deleted);
        
        if (!deleted) return res.status(404).json({ error: 'Note not found' });

        res.status(200).json({
            message:"Note deleted",
            success:true,
        });
    } catch (err) {
        console.error("Error deleting note:", err);
        res.status(500).json({ error: 'Failed to delete note' });
    }
};
