import bcrypt from 'bcryptjs';

export const seedUsers = async () => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash('Password@123', salt);

  return [
    {
      name: 'Admin User',
      email: 'admin@amazonclone.com',
      password: hashedPassword,
      phone: '9876543210',
      role: 'admin',
      isVerified: true,
      isPrime: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    },
    {
      name: 'Rahul Sharma',
      email: 'customer@amazonclone.com',
      password: hashedPassword,
      phone: '9876543211',
      role: 'customer',
      isVerified: true,
      isPrime: true,
      primeExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      addresses: [
        {
          fullName: 'Rahul Sharma',
          phoneNumber: '9876543211',
          addressLine1: 'Flat 402, Green Glen Layout',
          addressLine2: 'Outer Ring Road, Bellandur',
          landmark: 'Near EcoSpace',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560103',
          country: 'India',
          addressType: 'home',
          isDefault: true,
        },
        {
          fullName: 'Rahul Sharma',
          phoneNumber: '9876543211',
          addressLine1: 'Prestige Tech Park, Block B',
          addressLine2: 'Marathahalli-Sarjapur Road',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560103',
          country: 'India',
          addressType: 'work',
          isDefault: false,
        },
      ],
    },
    {
      name: 'Priya Patel',
      email: 'priya@amazonclone.com',
      password: hashedPassword,
      phone: '9876543212',
      role: 'customer',
      isVerified: true,
      isPrime: false,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
      addresses: [
        {
          fullName: 'Priya Patel',
          phoneNumber: '9876543212',
          addressLine1: 'A-12, Shanti Nagar Society',
          addressLine2: 'SG Highway',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380015',
          country: 'India',
          addressType: 'home',
          isDefault: true,
        },
      ],
    },
    {
      name: 'Appario Retail Seller',
      email: 'seller@amazonclone.com',
      password: hashedPassword,
      phone: '9876543213',
      role: 'seller',
      isVerified: true,
      isPrime: true,
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300',
    },
    {
      name: 'Cloudtail India Seller',
      email: 'cloudtail@amazonclone.com',
      password: hashedPassword,
      phone: '9876543214',
      role: 'seller',
      isVerified: true,
      isPrime: true,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    },
  ];
};

export default seedUsers;
