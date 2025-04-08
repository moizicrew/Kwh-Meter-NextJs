'use server';

import prisma from "@/lib/db";
// import puppeteer from "puppeteer";
import bcrypt from "bcryptjs";



export async function saveData(avg: number, kwh: number, biaya: number) {
  try {
    await prisma.kwhPrice.create({
      data: { avg, kwh, biaya },
    });
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

export async function getKwhPricesInRange(startDate: string, endDate: string) {
  try {
    const kwhPrices = await prisma.kwhPrice.findMany({
      where: {
        timestamp: {
          gte: new Date(startDate), // Lebih besar atau sama dengan startDate
          lte: new Date(endDate),   // Kurang dari atau sama dengan endDate
        },
      },
      orderBy: {
        timestamp: "asc", // Urutkan dari yang paling lama ke terbaru
      },
    });

    return kwhPrices;
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    return [];
  }
}

export async function SaveHasil(nobooster: number, booster:number){
    try {
        await prisma.hasil.create({
            data: {nobooster, booster},
        })
        console.log("Data Successfull Stored")
    } catch (error) {
        console.error("ERror Saving Data", error);
    }
}

export async function SaveHasilSumber(topic:string, value:number){
    try {
        await prisma.mqttData.create({
            data:{topic,value},
        })
        console.log("Data Successfull Stored")
    } catch (error) {
        console.error("ERror Saving Data", error);
        
    }
}

export async function saveDataAkun(email: string, password: string, username: string, role: string) {
  try {
    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, // Simpan password yang sudah di-hash
        username,
        role,
      },
    });

    console.log("Data Successfully Stored:", newUser);
    return newUser;
  } catch (error) {
    console.error("Error Saving Data:", error);
    throw new Error("Gagal menyimpan data akun");
  }
}

export async function Login(username: string, password: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
    console.error("User tidak ditemukan");
      
      throw new Error("User tidak ditemukan");
    }

    // Cek password dengan bcrypt.compare
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Password salah");
    }

    return { id: user.id, email: user.email, username: user.username };
  } catch (error) {
    console.error("Error saat login:", error);
    throw new Error("Gagal login");
  }
}

export async function getAkun() {
  try {
    const accounts = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        username:true
      },
    });
    return accounts; // ✅ Pastikan selalu mengembalikan array
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return []; // ✅ Jangan biarkan undefined atau void
  }
}


export async function deleteAkun(id:number) {
 try {
  await prisma.user.delete({where:{id: id}});

  console.log("User sudah berhasil dihapus");
 } catch (error) {
  console.log("Error fetching akun: ", error);
 } 
}

export async function updateAkun(id:number, email:string, role:string, username:string){
  try {
    await prisma.user.update({
      where:{id: id},
      data:{
        email: email,
        role: role,
        username:username
      }
    })
  } catch (error) {
  console.log("Error fetching akun: ", error);
  }
}

// export async function getPdf(htmlContent) {
  
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   await page.setContent(htmlContent, { waitUntil: "networkidle0" });
//   await page.pdf({ format: "A4", printBackground: true });

//   await browser.close();
// }

