import mongoose from 'mongoose';

const sweetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Nut-Based', 'Milk-Based', 'Vegetable-Based','Chocolate', 'Candy', 'pastry'], 
  },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const Sweet = mongoose.model('Sweet', sweetSchema);

export default Sweet;
