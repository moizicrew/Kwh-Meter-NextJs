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

export async function saveDataAkun(email: string, password: string, name: string, role: string) {
  try {
    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, // Simpan password yang sudah di-hash
        name,
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

export async function getAkun() {
  try {
    const accounts = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        name:true
      },
    });
    return accounts; // ✅ Pastikan selalu mengembalikan array
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return []; // ✅ Jangan biarkan undefined atau void
  }
}


export async function deleteAkun(id:string) {
 try {
  await prisma.user.delete({where:{id: id}});

  console.log("User sudah berhasil dihapus");
 } catch (error) {
  console.log("Error fetching akun: ", error);
 } 
}

export async function updateAkun(id:string, email:string, role:string, name:string){
  try {
    await prisma.user.update({
      where:{id: id},
      data:{
        email: email,
        role: role,
        name:name
      }
    })
    // redirect("/akun");

  } catch (error) {
  console.log("Error fetching akun: ", error);
  throw error;
  }

}

// export async function getPdf(htmlContent) {
  
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   await page.setContent(htmlContent, { waitUntil: "networkidle0" });
//   await page.pdf({ format: "A4", printBackground: true });

//   await browser.close();
// }

