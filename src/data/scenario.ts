export interface Dialogue {
  character: string;
  role: string;
  text: string;
  type: 'neutral' | 'pro' | 'con';
  image: string;
  voiceParams?: {
    pitch?: number;
    rate?: number;
    voiceIndex?: number; // Added to support multiple voices
  };
}

export interface ScenarioData {
  title: string;
  background: string;
  description: string;
  descriptionImage: string;
  dialogues: Dialogue[];
  hints: {
    level1: {
        teamMove: string[];
        teamSettle: string[];
    };
    level2: string[];
  };
  outcomes: {
    move: {
      success: { text: string; points: string };
      failure: { text: string; points: string };
    };
    settle: {
      success: { text: string; points: string };
      failure: { text: string; points: string };
    };
  };
}

export const scenario1: ScenarioData = {
  title: "🏛 시나리오 1. 고조선 시대: \"내일의 사슴인가, 내년의 쌀인가?\"",
  background: "고조선 시대",
  description: "오랜 세월 우리 부족은 숲을 누비며 사슴을 잡고 열매를 따며 살았습니다. 하지만 날씨가 추워지면서 숲에 먹을 것이 사라지고 부족원들이 하나둘 굶주림에 쓰러지고 있습니다. 이때 옆 나라에서 '농사'라는 새로운 기술을 배운 사람들이 나타났습니다.",
  descriptionImage: "/input_file_0.png",
  dialogues: [
    {
      character: "추장",
      role: "진행자",
      text: "모두 모여라! 올겨울은 유독 길고 춥구나. 아이들이 배고픔에 울고 있다. 이제 우리 부족이 살아남기 위한 큰 결정을 내려야 한다!",
      type: 'neutral',
      image: "/input_file_1.jpg",
      voiceParams: { pitch: 0.8, rate: 0.9, voiceIndex: 0 }
    },
    {
      character: "날쌘돌이 대장",
      role: "수렵·채집 측",
      text: "추장님! 우리는 수천 년 동안 이 숲의 주인이었습니다. 저 산맥만 넘으면 아직 사냥할 짐승들이 많습니다! 땅을 파고 씨를 뿌리는 '농사'라니요? 그건 땅에 묶인 노예가 되는 길입니다. 짐승을 쫓아 자유롭게 이동하며 사는 것이 우리 조상의 긍지입니다. 당장 짐을 꾸려 새로운 숲으로 떠납시다!",
      type: 'con',
      image: "/input_file_1.jpg",
      voiceParams: { pitch: 1.1, rate: 1.05, voiceIndex: 1 }
    },
    {
      character: "지혜로운 할머니",
      role: "농경·정착 측",
      text: "잠깐만요! 이동하는 것이 언제까지 가능할까요? 추위는 더 심해지고 사냥감은 줄고 있습니다. 우리가 힘들어도 땅을 일구고 정착한다면, 내년엔 곡식을 저장해 굶지 않을 수 있습니다. 튼튼한 울타리를 세우고 마을을 만들면 짐승들이 못 들어오게 막을 수 있습니다. 우리 아이들에게 '내일의 사냥감'이 아닌 '내년의 안정'을 물려줍시다!",
      type: 'pro',
      image: "/input_file_2.png",
      voiceParams: { pitch: 0.9, rate: 0.85, voiceIndex: 2 }
    }
  ],
  hints: {
    level1: {
        teamMove: ["#자유", "#도전", "#도망치기", "#조상님", "#새로운땅"],
        teamSettle: ["#안전", "#창고", "#우리집", "#울타리", "#함께살기"]
    },
    level2: [
      "땅을 파는 힘든 일을 안 해도 돼요. 숲으로 가서 사과를 따고 토끼를 잡으며 자유롭게 사는 게 우리 스타일이에요!",
      "무서운 적이 쳐들어오면 짐을 싸서 빨리 도망칠 수 있어요. 한곳에 있으면 다 같이 위험해질 수 있거든요.",
      "사냥에 실패하면 오늘 저녁에 굶어야 할 수도 있어요. 먹을 게 없으면 또 길을 떠나야 해서 힘들어요.",
      "길을 가다가 무서운 짐승을 만나거나, 험한 산에서 다칠 수 있어서 조금 위험해요.",
      "곡식을 키워서 창고에 꽉 채워두면, 눈이 많이 와도 굶을 걱정이 없어요. 마음이 든든해져요!",
      "튼튼한 울타리를 만들면 짐승들이 못 들어와요. 다리가 아픈 할머니나 어린 동생들도 안전하게 보호할 수 있어요.",
      "농사는 정말 힘들어요. 하루 종일 허리를 숙여서 일해야 하고, 가뭄이 들어서 비가 안 오면 농사를 망칠 수도 있어요.",
      "우리가 열심히 키운 곡식을 뺏으러 다른 마을 사람들이 올 수도 있어요. 그때는 무섭지만 맞서 싸워야 해요."
    ]
  },
  outcomes: {
    settle: {
      success: { 
          text: "강가 근처에 자리를 잘 잡았습니다. 농사가 대박이 나 정착 생활이 안정됩니다.", 
          points: "승점 +2, 혁명 0" 
      },
      failure: { 
          text: "비가 오지 않아 농사를 망쳤습니다. 배고픈 부족민들이 이동하자며 불만을 터뜨립니다.", 
          points: "승점 0, 혁명 +1" 
      }
    },
    move: {
      success: { 
          text: "이동한 산속에서 짐승과 열매를 잔뜩 찾아냈습니다. 당분간 먹을 걱정이 없습니다.", 
          points: "승점 +2, 혁명 +0, 시대의 유물 카드" 
      },
      failure: { 
          text: "이동 중에 맹수를 만나고 잠자리가 마땅치 않아 부족원들이 다쳤습니다.", 
          points: "승점 0, 혁명 +2" 
      }
    }
  }
};
