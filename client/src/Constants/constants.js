import LOGO from '/images/logo.jpg';

const LIMIT = 10;
const DEFAULT_RTE_TEXT = 'Welcome to Post Manager ⭐';
const EMAIL = 'peerconnect@gmail.com';
const CONTACTNUMBER = 'xxxxxxxxxx';
const MAX_FILE_SIZE = 5;
const BASE_BACKEND_URL = import.meta.env.VITE_BACKEND_BASE_URL + '/api';
const SERVER_ERROR = 500;
const BAD_REQUEST = 400;
const USER_AVATAR =
    'https://res.cloudinary.com/dddnbyltc/image/upload/v1741966812/aggldxme6x3lszagjypr.png';

const TAILWIND_COLORS = [
    'text-blue-600',
    'text-teal-600',
    'text-indigo-600',
    'text-purple-600',
    'text-pink-600',
    'text-rose-600',
    'text-yellow-600',
    'text-green-600',
    'text-emerald-600',
    'text-cyan-600',
];

const IMAGES = {
    contributors: {
        sania: '/images/sania.jpg',
        vasundhra: '/images/vasundhra.jpg',
        seerat: '/images/seerat.jpg',
    },
    companies: [
        '/images/companies/adobe.png',
        '/images/companies/amazon.png',
        '/images/companies/facebook.png',
        '/images/companies/hostinger.png',
        '/images/companies/pinterest.png',
        '/images/companies/quora.png',
        '/images/companies/reddit.png',
        '/images/companies/skype.png',
        '/images/companies/spotify.png',
        '/images/companies/telegram.png',
        '/images/companies/tiktok.png',
        '/images/companies/yahoo.png',
    ],
    dsa: {
        array: '/images/dsa/array.png',
        string: '/images/dsa/string.png',
        dp: '/images/dsa/dp.png',
        graph: '/images/dsa/graph.png',
        tree: '/images/dsa/tree.png',
    },
    tech: '/images/tech.svg',
    robot: '/images/robot.png',
    resume: '/images/resume.png',
    resumeCover: '/images/resumeCover.png',
};

const CONTRIBUTORS = [
    {
        image: IMAGES.contributors.sania,
        role: 'Lead Developer',
        bio: 'Visionary Full Stack Developer crafting impactful, real-world solutions with precision and purpose.',
        name: 'Sania Singla',
        socials: {
            linkedIn: 'https://www.linkedin.com/in/sania-singla',
            discord: 'https://discord.com/channels/@sania_singla',
            gitHub: 'https://github.com/Sania-Singla',
            threads: 'https://x.com/sania_singla',
            instagram: 'https://www.instagram.com/sania__singla',
        },
    },
    {
        image: IMAGES.contributors.vasundhra,
        role: 'Full Stack Developer',
        bio: 'Innovative full stack developer specializing in smart bots and scalable systems that solve real-world problems.',
        name: 'Vasundhra Gupta',
        socials: {
            linkedIn: 'https://www.linkedin.com/in/vasundhra-gupta-764713291',
            discord: '',
            gitHub: 'https://github.com/Vasundhra-Gupta',
            threads: '',
            instagram: 'https://www.instagram.com/vasundhragupta962',
        },
    },
    {
        image: IMAGES.contributors.seerat,
        role: 'Aspiring Full-Stack Developer',
        bio: 'Passionate about coding and building real-world projects with a strong foundation in Java, C++, HTML, CSS , js.',
        name: 'Seerat Grover',
        socials: {
            linkedIn: 'https://www.linkedin.com/in/seerat-grover-105233344 ',
            discord: '',
            gitHub: 'https://github.com/Grover-Seerat',
            threads: '',
            instagram: '',
        },
    },
];

const LANGUAGES = [
    'python3',
    'java',
    'cpp',
    'nodejs',
    'c',
    'ruby',
    'go',
    'scala',
    'bash',
    'sql',
    'pascal',
    'csharp',
    'php',
    'swift',
    'rust',
    'r',
];

const BOILER_PLATE_CODES = {
    python3: `
def main():
    # your code goes here
    pass

if __name__ == "__main__":
    main()
    `.trim(),

    java: `
public class Main {
    public static void main(String[] args) {
        // your code goes here
    }
}
    `.trim(),

    cpp: `
#include <iostream>
int main() {
    // your code goes here
    return 0;
}
    `.trim(),

    nodejs: `
function main() {
    // your code goes here
}

main();
    `.trim(),

    c: `
#include <stdio.h>
int main() {
    // your code goes here
    return 0;
}
    `.trim(),

    ruby: `
def main
  # your code goes here
end

main
    `.trim(),

    go: `
package main
import "fmt"

func main() {
    // your code goes here
}
    `.trim(),

    scala: `
object Main {
  def main(args: Array[String]): Unit = {
    // your code goes here
  }
}
    `.trim(),

    bash: `
#!/bin/bash
# your code goes here
    `.trim(),

    sql: `
-- your code goes here
SELECT 'your code goes here';
    `.trim(),

    pascal: `
program HelloWorld;
begin
  // your code goes here
end.
    `.trim(),

    csharp: `
using System;
class Program {
    static void Main() {
        // your code goes here
    }
}
    `.trim(),

    php: `
<?php
// your code goes here
?>
    `.trim(),

    swift: `
import Foundation

func main() {
    // your code goes here
}

main()
    `.trim(),

    rust: `
fn main() {
    // your code goes here
}
    `.trim(),

    r: `
# your code goes here
main <- function() {
    # your code goes here
}

main()
    `.trim(),
};

const QUES_LANGUAGES = ['nodejs', 'python3', 'java', 'cpp', 'c', 'ruby', 'go'];

export {
    LIMIT,
    BASE_BACKEND_URL,
    DEFAULT_RTE_TEXT,
    LOGO,
    SERVER_ERROR,
    BAD_REQUEST,
    MAX_FILE_SIZE,
    CONTRIBUTORS,
    EMAIL,
    CONTACTNUMBER,
    TAILWIND_COLORS,
    BOILER_PLATE_CODES,
    IMAGES,
    LANGUAGES,
    QUES_LANGUAGES,
    USER_AVATAR,
};
