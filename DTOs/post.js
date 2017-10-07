const PostDAO = require('../DAOs/post');

class PostDTO {
    constructor(userId, title, intro, age, spiece, neutral, lineage, region, fee, condition, gender, vac1, vac2, vac3, vac4){
        this.user_id = userId;
        this.title = title;
        this.introduction = intro;
        this.age = age;
        this.spiece = spiece;
        this.neutralization = neutral;
        this.lineage_book = lineage;
        this.region = region;
        this.fee = fee;
        this.condition = condition;
        this.gender = gender;
        this.combi_vaccin_1 = vac1;
        this.combi_vaccin_2 = vac2;
        this.combi_vaccin_3 = vac3;
        this.rabies_vaccin = vac4;
    }
    
}

PostDTO.getPostsByPage = async function(page){
    let posts = await PostDAO.selectAll();
    let array = [];
    for(let i = page*6-1; i>=(page-1)*6; i--)
        array.push(posts[i]);
    return array;
}

module.exports = PostDTO;