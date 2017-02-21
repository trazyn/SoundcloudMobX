//
//  SplashScrren.m
//  SoundcloudMboX
//
//  Created by Darling on 2/22/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "SplashScreen.h"

static bool waiting = true;

@implementation SplashScreen
RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

+ (void)show {
  while (waiting) {
    NSDate* later = [NSDate dateWithTimeIntervalSinceNow:0.1];
    [[NSRunLoop mainRunLoop] runUntilDate:later];
  }
}

RCT_EXPORT_METHOD(hide) {
  dispatch_async(dispatch_get_main_queue(),
                 ^{
                   waiting = false;
                 });
}

@end
